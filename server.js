const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const userRoutes = require('./Holder1/Routes/user.routes');
const otpRoutes = require('./Holder1/Routes/otp.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration for production
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || origin === 'https://ecomexpress-0dc3.onrender.com') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
    maxAge: 86400,
    optionsSuccessStatus: 204
};

// Apply CORS globally
app.use(cors(corsOptions));

// Add request logging
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.path}`);
    next();
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    console.error('Stack:', err.stack);
    console.error('Request URL:', req.originalUrl);
    console.error('Request method:', req.method);
    
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message || 'An unexpected error occurred'
    });
});

// Routes
app.use('/user', userRoutes);
app.use('/user/otp', otpRoutes);

// MongoDB connection
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log('CORS configured for:', corsOptions.origin);
    });
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});
