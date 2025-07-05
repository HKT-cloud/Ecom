const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const userRoutes = require('./Holder1/Routes/user.routes');
const otpRoutes = require('./Holder1/Routes/otp.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global OPTIONS handler
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'https://ecomexpress-0dc3.onrender.com');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');
    res.sendStatus(204);
});

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://ecomexpress-0dc3.onrender.com');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// Routes
app.use('/user', userRoutes);
app.use('/user/otp', otpRoutes);

// MongoDB connection
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});
