require("dotenv").config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const incomeRoutes = require('./routes/incomeRoutes')
const expenseRoutes = require('./routes/expenseRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')

const PORT = process.env.PORT || 5000

const app = express()

const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options(/(.*)/, cors());

app.use(express.json())

connectDB()

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/income", incomeRoutes)
app.use("/api/v1/expense", expenseRoutes)
app.use("/api/v1/dashboard", dashboardRoutes)

//Serving upload folder
app.use('/uploads', express.static(path.join(__dirname, "uploads")))

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})

app.get('/', (req, res) => {
  res.send('This is budgee backend - with realtime data update')
})

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})