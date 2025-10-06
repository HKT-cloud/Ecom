const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./db');
const userRoutes = require('./Holder1/Routes/user.routes');
const otpRoutes = require('./Holder1/Routes/otp.routes');
const UserModel = require('./Holder1/Module/user.model');

const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

// Set up environment variables
const env = process.env.NODE_ENV || 'development';
console.log(`Starting in ${env} mode`);

// Log environment variables
console.log('Environment variables:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET ? 'configured' : 'not configured'
});

// ✅ Allow CORS from frontend
const allowedOrigins = [
  'https://ecomexpress-0dc3.onrender.com',
  'https://ecomexpress-dn3d.onrender.com',
  'http://localhost:5173' // For local development
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use('/user', userRoutes);
app.use('/otp', otpRoutes);

// Add health check endpoint
app.get('/health', async (req, res) => {
    try {
        // Check database connection
        const db = mongoose.connection;
        if (db.readyState !== 1) {
            return res.status(503).json({
                status: 'error',
                message: 'Database connection not ready',
                details: {
                    readyState: db.readyState,
                    host: db.host,
                    name: db.name
                }
            });
        }

        // Test database query
        const count = await UserModel.estimatedDocumentCount();
        
        return res.status(200).json({
            status: 'ok',
            database: {
                connected: true,
                usersCount: count,
                collection: UserModel.collection.collectionName
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Health check error:', {
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        return res.status(500).json({
            status: 'error',
            message: 'Database check failed',
            error: error.message
        });
    }
});

// ✅ Make sure Express handles preflight OPTIONS requests globally
app.options('*', cors());

// ✅ Basic request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        request: {
            method: req.method,
            url: req.originalUrl,
            body: req.body
        }
    });

    // Don't expose sensitive error details to client
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
        error: env === 'development' ? err.message : 'An unexpected error occurred'
    });
});
// Remove duplicate route mounts
// ✅ Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
