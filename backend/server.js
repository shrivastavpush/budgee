require("dotenv").config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const PORT = process.env.PORT || 5000

const app = express()

//middleware to handle CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-type", "Authorizatoion"],
    })
)

app.use(express.json())

connectDB()

app.use("/api/v1/auth", authRoutes)

//Serving upload folder
app.use('/uploads', express.static(path.join(__dirname, "uploads")))

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})

app.get('/', (req, res) => {
    res.send('This is budgee backend - with realtime data update')
})