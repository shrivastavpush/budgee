require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const { allowedOrigins } = require('./config/origins')
const { closeRedis } = require('./config/redis')
const setupCron = require('./cron')
const authRoutes = require('./routes/authRoutes')
const incomeRoutes = require('./routes/incomeRoutes')
const expenseRoutes = require('./routes/expenseRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const sanitizeRequest = require('./middleware/sanitize')

const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const hpp = require('hpp')

const PORT = process.env.PORT || 5000

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be set and at least 32 characters')
}

const app = express()
app.set('trust proxy', 1)

app.use(helmet())
app.use(compression())
app.use(hpp())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        console.error(`Blocked by CORS from origin: ${origin}`)
        callback(new Error('Not allowed by CORS'))
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

app.disable('x-powered-by')
app.use(express.json({ limit: '10kb' }))
app.use(sanitizeRequest)

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/income', incomeRoutes)
app.use('/api/v1/expense', expenseRoutes)
app.use('/api/v1/dashboard', dashboardRoutes)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/', (req, res) => {
  res.send('This is budgee backend - with realtime data update')
})

app.get('/health', (req, res) => {
  const ok = mongoose.connection.readyState === 1
  res.status(ok ? 200 : 503).json({ status: ok ? 'ok' : 'unavailable' })
})

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.use((err, req, res, _next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'Not allowed by CORS' })
  }

  if (err.type === 'entity.too.large' || err.type === 'entity.parse.failed') {
    return res
      .status(err.status || 400)
      .json({ message: 'Invalid request body' })
  }
  if (err.name === 'MulterError' || err.message?.startsWith('Only .jpeg')) {
    return res.status(400).json({ message: err.message })
  }

  console.error(err.stack)
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  })
})

// Fail fast and let the process manager restart on unexpected errors.
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason)
})
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err)
  process.exit(1)
})

const start = async () => {
  try {
    await connectDB()
    setupCron()
    const server = app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`)
    })
    server.keepAliveTimeout = 65 * 1000 // above typical LB idle timeout (60s)
    server.headersTimeout = 66 * 1000
    server.requestTimeout = 30 * 1000 // drop slow/stalled requests

    const shutdown = (signal) => {
      console.log(`${signal} received, shutting down`)
      server.close(async () => {
        await mongoose.connection.close()
        await closeRedis().catch(() => {})
        process.exit(0)
      })
      setTimeout(() => process.exit(1), 10000).unref()
    }
    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT', () => shutdown('SIGINT'))
  } catch (error) {
    console.log('Error connecting MongoDB', error)
    process.exit(1)
  }
}

start()
