const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const userRoutes = require('./Holder1/Routes/user.routes');
const otpRoutes = require('./Holder1/Routes/otp.routes');

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
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
}));

// ✅ Make sure Express handles preflight OPTIONS requests globally
app.options('*', cors());

// ✅ Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use(express.urlencoded({ extended: true }));

// ✅ Your routes
app.use('/user', userRoutes);
app.use('/user/otp', otpRoutes);

// ✅ Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
