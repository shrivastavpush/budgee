require('dotenv').config();
const mongoose = require('mongoose');

console.log("--- DIAGNOSTIC START ---");
console.log("Checking Environment Variables...");

const requiredVars = ['MONGO_URI', 'JWT_SECRET', 'CLIENT_URL'];
const missingVars = requiredVars.filter(key => !process.env[key]);

if (missingVars.length > 0) {
  console.error(`❌ CRITICAL: Missing Environment Variables: ${missingVars.join(', ')}`);
} else {
  console.log("✅ All required Environment Variables are present.");
}

console.log(`JWT_SECRET is present: ${!!process.env.JWT_SECRET}`);

console.log("Testing MongoDB Connection...");
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing, skipping DB test.");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connection Successful!");
    console.log("--- DIAGNOSTIC END ---");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection FAILED:", err.message);
    console.log("--- DIAGNOSTIC END ---");
    process.exit(1);
  });
