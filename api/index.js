// Root Vercel Serverless Entry Point for FieldFlow Backend API
// When deploying the entire repo to Vercel, this serverless function handles all /api/* requests.
require('dotenv').config();
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '8.8.4.4']); } catch(e){}

const mongoose = require('mongoose');
const app = require('../fieldflow backend/src/app');
const connectDB = require('../fieldflow backend/src/config/db');
const seedDB = require('../fieldflow backend/src/data/dbSeeder');

let dbInitialized = false;

const ensureDB = async () => {
  if (dbInitialized && mongoose.connection.readyState === 1) {
    return;
  }
  try {
    await connectDB(1);
    dbInitialized = true;
    await seedDB();
  } catch (err) {
    console.error('[Root Vercel Serverless] MongoDB connection error:', err.message);
  }
};

module.exports = async (req, res) => {
  await ensureDB();
  return app(req, res);
};
