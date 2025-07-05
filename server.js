const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./db');
const userRoutes = require('./Routes/user.routes');
const otpRoutes = require('./Holder1/Routes/otp.routes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || origin === 'http://localhost:5173') {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    maxAge: 86400, // 24 hours
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Routes
app.use('/user', userRoutes);
app.use('/user/otp', otpRoutes); // Add OTP routes under user namespace

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    console.error('Error stack:', err.stack);
    
    // Check if error is a known type
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            error: err.message,
            details: err.errors
        });
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
            error: 'Invalid or expired token'
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

// Start server after MongoDB connection is established
connectDB().then(() => {
    const PORT = process.env.PORT || 3000;
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
