const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Connects to your local MongoDB instance
    const conn = await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/furniture_mock_db",
    );
    console.log(`Real MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
