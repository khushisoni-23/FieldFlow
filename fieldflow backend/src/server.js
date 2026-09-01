require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const seedDB = require('./data/dbSeeder');

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  let dbConnected = false;

  // Try to connect to Database (non-fatal if on restricted network)
  try {
    await connectDB();
    dbConnected = true;

    // Only run seeding if DB connected
    await seedDB();
  } catch (err) {
    console.warn(`\n  ⚠️  MongoDB could not be reached: ${err.message}`);
    console.warn(`  Running server WITHOUT database (demo/mock mode).`);
    console.warn(`  Some API endpoints may return errors — use mock mode in frontend.\n`);
  }

  // Start HTTP Server regardless of DB status
  const server = app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`  FieldFlow API Server is running        `);
    console.log(`  Port: ${PORT}                          `);
    console.log(`  Environment: ${process.env.NODE_ENV}  `);
    console.log(`  DB Connected: ${dbConnected ? 'YES ✅' : 'NO ❌ (mock mode)'}  `);
    console.log(`=========================================`);
  });

  // Graceful shutdown handling
  const gracefulShutdown = () => {
    console.log('Signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
};

startServer();
