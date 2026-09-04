// Root Vercel Serverless Entry Point for FieldFlow Backend API
// Resolve all backend dependencies from fieldflow backend/node_modules
const path = require('path');
const backendModules = path.resolve(__dirname, '../fieldflow backend/node_modules');

if (process.env.NODE_PATH) {
  process.env.NODE_PATH += (path.delimiter + backendModules);
} else {
  process.env.NODE_PATH = backendModules;
}
require('module')._initPaths();

// Load environment variables
const dotenv = require('dotenv');
dotenv.config();

// DNS resolution for MongoDB Atlas SRV
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
