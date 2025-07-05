const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./db');
const userRoutes = require('./Holder1/Controller/user.controller');
const otpRoutes = require('./Holder1/Routes/otp.routes');

const app = express();

// Set up environment
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecomexpress';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: ['http://localhost:5173', 'https://ecomexpress-0dc3.onrender.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
    optionsSuccessStatus: 204
};

// Add request logging
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.path}`);
    next();
});

app.use(cors(corsOptions));              // ✅ Set CORS
app.options('*', cors(corsOptions));     // ✅ Preflight CORS support

// Routes
app.use('/user', userRoutes);
app.use('/user/otp', otpRoutes); // Add OTP routes under user namespace

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    console.error('Error stack:', err.stack);
    console.error('Request URL:', req.originalUrl);
    console.error('Request method:', req.method);
    
    // Check if error is a known type
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            error: err.message,
            details: err.errors
        });
    }

    // Handle other errors
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// MongoDB connection
connectDB(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    });
    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
            error: err.message
        });
    }

    // Handle token expiration
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired',
            error: err.message
        });
    }

    // Handle database errors
    if (err.name === 'MongoError') {
        return res.status(500).json({
            success: false,
            message: 'Database error',
            error: err.message
        });
    }

    // Default error handling
    return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message || 'An unexpected error occurred'
    });
});

// MongoDB connection
connectDB(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log('MongoDB Connected: ✅ Connected');
    }).on('error', (error) => {
        console.error('Server error:', error);
        process.exit(1);
    });
}).catch((err) => {
    console.error('MongoDB connection error:', err);
    console.error('MongoDB connection error details:', err.stack);
    process.exit(1);
});
