require("dotenv").config()
const express = require('express')
const mongoSanitize = require('express-mongo-sanitize')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const incomeRoutes = require('./routes/incomeRoutes')
const expenseRoutes = require('./routes/expenseRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')

const PORT = process.env.PORT || 5000

const app = express()
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "https://budgeee.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`Blocked by CORS from origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options(/(.*)/, cors());

app.use(express.json({ limit: '10kb' })) // Limit payload size
app.use(mongoSanitize())

connectDB()

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/income", incomeRoutes)
app.use("/api/v1/expense", expenseRoutes)
app.use("/api/v1/dashboard", dashboardRoutes)

//Serving upload folder
app.use('/uploads', express.static(path.join(__dirname, "uploads")))

app.get('/', (req, res) => {
  res.send('This is budgee backend - with realtime data update')
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
  console.log(`Running in ${process.env.NODE_ENV} mode`)
})

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack)

  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"

  res.status(statusCode).json({
    message: message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
})