require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const connectDB = require('./config/db')
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

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not set')
}

const app = express()
app.set('trust proxy', 1)

app.use(helmet())
app.use(compression())
app.use(hpp())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'https://budgee-rho.vercel.app',
].filter(Boolean)

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

app.options(/(.*)/, cors())

app.use(express.json())
app.use(sanitizeRequest)

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/income', incomeRoutes)
app.use('/api/v1/expense', expenseRoutes)
app.use('/api/v1/dashboard', dashboardRoutes)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/', (req, res) => {
  res.send('This is budgee backend - with realtime data update')
})

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.use((err, req, res, _next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'Not allowed by CORS' })
  }

  console.error(err.stack)
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  })
})

const start = async () => {
  try {
    await connectDB()
    setupCron()
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`)
    })
  } catch (error) {
    console.log('Error connecting MongoDB', error)
    process.exit(1)
  }
}

start()
