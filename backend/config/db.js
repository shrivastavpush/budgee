const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {})
        console.log("MongoDb connected");
    } catch (error) {
        console.log("Error connecting MongoDB", error);
        process.exit(1)
    }
}

module.exports = connectDB