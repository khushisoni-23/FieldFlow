const mongoose = require('mongoose');

const connectDB = async () => {
  const connString = process.env.MONGODB_URI;
  if (!connString) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  const conn = await mongoose.connect(connString, {
    serverSelectionTimeoutMS: 8000,   // 8s timeout instead of default 30s
    connectTimeoutMS: 8000,
    socketTimeoutMS: 30000,
    family: 4,                        // Force IPv4 — avoids issues on some networks
  });

  console.log(`=========================================`);
  console.log(`  MongoDB Connected Successfully         `);
  console.log(`  Host: ${conn.connection.host}         `);
  console.log(`  Database: ${conn.connection.name}     `);
  console.log(`=========================================`);
};

module.exports = connectDB;
