const mongoose = require('mongoose')

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not set')
  }

  await mongoose.connect(process.env.MONGO_URI)
  console.log('MongoDb connected')
}

module.exports = connectDB
