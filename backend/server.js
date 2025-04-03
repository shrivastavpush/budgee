require("dotenv").config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const connectDB = require('./config/db')
const { cacheMiddleware } = require('./config/cache')
const authRoutes = require('./routes/authRoutes')
const incomeRoutes = require('./routes/incomeRoutes')
const expenseRoutes = require('./routes/expenseRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')

const PORT = process.env.PORT || 5000

const app = express()

const allowedOrigins = ["https://budgeee.vercel.app", "http://localhost:5173"];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

app.options("*", cors());

app.use(express.json())

connectDB()

// Apply cache middleware to routes
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/income", cacheMiddleware(300), incomeRoutes) // Cache income routes for 5 minutes
app.use("/api/v1/expense", cacheMiddleware(300), expenseRoutes) // Cache expense routes for 5 minutes
app.use("/api/v1/dashboard", cacheMiddleware(60), dashboardRoutes) // Cache dashboard routes for 1 minute

//Serving upload folder
app.use('/uploads', express.static(path.join(__dirname, "uploads")))

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})

app.get('/', (req, res) => {
    res.send('This is budgee backend - with realtime data update')
})