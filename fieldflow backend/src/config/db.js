const mongoose = require('mongoose');
const dns = require('dns');

// Configure DNS to resolve SRV records properly on Windows/local networks
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Ignore if not permitted
}

// Cache connection state for serverless environments (Vercel)
let cached = global._mongooseConnection;
if (!cached) {
  cached = global._mongooseConnection = { conn: null, promise: null };
}

const connectDB = async (retries = 2) => {
  const connString = process.env.MONGODB_URI;
  if (!connString) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  // Return cached connection if already connected
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If a connection attempt is already in progress, wait for it
  if (cached.promise) {
    cached.conn = await cached.promise;
    return cached.conn;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      cached.promise = mongoose.connect(connString, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        bufferCommands: true,
      });

      const conn = await cached.promise;
      cached.conn = conn;

      console.log(`=========================================`);
      console.log(`  MongoDB Connected Successfully         `);
      console.log(`  Host: ${conn.connection.host}         `);
      console.log(`  Database: ${conn.connection.name}     `);
      console.log(`=========================================`);
      return conn;
    } catch (err) {
      cached.promise = null;
      console.warn(`  [DB] Attempt ${attempt}/${retries} failed: ${err.message}`);
      if (attempt === retries) {
        mongoose.set('bufferCommands', false);
        throw err;
      }
      await new Promise(res => setTimeout(res, 1500));
    }
  }
};

module.exports = connectDB;
