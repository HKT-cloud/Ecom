const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const userRoutes = require('./Holder1/Routes/user.routes');
const otpRoutes = require('./Holder1/Routes/otp.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: ['http://localhost:5173', 'https://ecomexpress-0dc3.onrender.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use('/user', userRoutes);
app.use('/user/otp', otpRoutes);

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});
