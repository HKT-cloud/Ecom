// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const userRoutes = require('./Holder1/Routes/user.routes'); // ← import router
const otpRoutes = require('./Holder1/Routes/otp.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS middleware - PLACE BEFORE routes
app.use(cors({
    origin: 'https://ecomexpress-0dc3.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Use router correctly
app.use('/user', userRoutes);
app.use('/user/otp', otpRoutes);

// MongoDB & Server start
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});
