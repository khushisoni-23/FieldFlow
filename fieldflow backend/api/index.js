// Vercel Serverless Entry Point for FieldFlow Backend
// This file wraps the Express app for Vercel's serverless environment.
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('../src/app');
const connectDB = require('../src/config/db');
const seedDB = require('../src/data/dbSeeder');

// Cache DB connection across serverless invocations (Vercel keeps warm containers)
let dbInitialized = false;

const ensureDB = async () => {
  if (dbInitialized && mongoose.connection.readyState === 1) {
    return; // Already connected
  }
  try {
    await connectDB(1); // Single attempt in serverless (no retries to avoid timeout)
    dbInitialized = true;
    // Seed only on first connection
    await seedDB();
  } catch (err) {
    console.error('[Vercel Serverless] MongoDB connection failed:', err.message);
    // Don't throw — let the API handle individual request errors
  }
};

// Wrap with DB connection
module.exports = async (req, res) => {
  await ensureDB();
  return app(req, res);
};
