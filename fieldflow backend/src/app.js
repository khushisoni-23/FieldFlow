require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./config/swagger');
const errorHandler = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const technicianRoutes = require('./routes/technicianRoutes');
const jobRoutes = require('./routes/jobRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const searchRoutes = require('./routes/searchRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// CORS configuration - dynamic origin validation supporting local development and Vercel deployments
const allowedOrigins = [
  'https://field-flow-pi.vercel.app',
  'https://field-flow-nine.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000'
];

if (process.env.CORS_ORIGIN) {
  process.env.CORS_ORIGIN.split(',').forEach(o => {
    const trimmed = o.trim();
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, serverless health checks)
    if (!origin) return callback(null, true);
    
    if (
      allowedOrigins.includes(origin) ||
      /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/.test(origin) ||
      /^http:\/\/localhost(:\d+)?$/.test(origin) ||
      /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)
    ) {
      return callback(null, true);
    }
    
    // Allow any origin if in development
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    return callback(new Error(`CORS policy does not allow access from origin: ${origin}`), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Logger middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI API Documentation Configuration
const swaggerUiOptions = {
  customSiteTitle: 'FieldFlow API Documentation',
  customCss: '.swagger-ui .topbar { display: none }',
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.js'
  ],
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'list'
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Raw OpenAPI JSON Specification Endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

/**
 * @swagger
 * tags:
 *   name: System
 *   description: Root status and server health checks
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Root API Welcome & Status
 *     description: Returns basic API status, version information, and documentation links.
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API status details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name: { type: string, example: 'FieldFlow Backend API' }
 *                 status: { type: string, example: 'online' }
 *                 version: { type: string, example: '1.0.0' }
 *                 documentation: { type: string, example: '/api-docs' }
 *                 timestamp: { type: string, format: 'date-time' }
 */
app.get('/', (req, res) => {
  res.json({
    name: 'FieldFlow Backend API',
    status: 'online',
    version: '1.0.0',
    documentation: '/api-docs',
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health Check API
 *     description: Checks server and MongoDB database connection status.
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server health and database connection status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'FieldFlow API is running' }
 *                 database: { type: string, example: 'connected' }
 *                 dbConnected: { type: boolean, example: true }
 *                 environment: { type: string, example: 'development' }
 *                 timestamp: { type: string, format: 'date-time' }
 */
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbState = mongoose.connection.readyState;
  const dbStatus = {0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting'};
  res.json({
    success: true,
    message: 'FieldFlow API is running',
    database: dbStatus[dbState] || 'unknown',
    dbConnected: dbState === 1,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// API Routing Binds
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/reports', reportRoutes);

// 404 Route handler
app.use((req, res, next) => {
  const err = new Error(`Route ${req.method} ${req.url} not found`);
  err.status = 404;
  next(err);
});

// Global Error Handler Middleware
app.use(errorHandler);

module.exports = app;
