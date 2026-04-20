const mongoose = require("mongoose");
require("dotenv").config();

let isDBConnected = false;

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not set in .env file");
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    isDBConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isDBConnected = false;
    console.error(`❌ MongoDB Error: ${error.message}`);
    console.log("⚠️  Server will continue without database - features will be limited");
    // Don't exit - allow server to start for WhatsApp
  }
};

// Retry connection every 30 seconds if not connected
const retryDBConnection = () => {
  if (!isDBConnected) {
    console.log("🔄 Retrying MongoDB connection...");
    connectDB();
  }
};

setInterval(retryDBConnection, 30000);

module.exports = { connectDB, isDBConnected: () => isDBConnected };
