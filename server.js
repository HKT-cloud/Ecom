const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const { login, signup, logout } = require('./Holder1/Controller/user.controller');
const otpRoutes = require('./Holder1/Routes/otp.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
    origin: 'https://ecomexpress-0dc3.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.post('/user/login', login);
app.post('/user/signup', signup);
app.get('/user/logout', logout);
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
