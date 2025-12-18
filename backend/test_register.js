require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

console.log("--- TEST REGISTER START ---");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "10h" });
}

async function testRegister() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = "password123";
    const fullName = "Test User";

    console.log(`Attempting to create user: ${testEmail}`);

    // Check pre-save hook effectively
    const user = new User({
      fullName,
      email: testEmail,
      password: testPassword
    });

    console.log("User instance created. Saving...");
    await user.save();
    console.log("User saved successfully!");
    console.log("User ID:", user._id);

    const token = generateToken(user._id);
    console.log("Token generated successfully:", token ? "Yes" : "No");

    await User.deleteOne({ _id: user._id });
    console.log("Test user cleaned up.");

  } catch (error) {
    console.error("❌ TEST FAILED:", error);
  } finally {
    await mongoose.disconnect();
  }
}

testRegister();
