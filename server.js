const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const userRoutes = require('./Holder1/Routes/user.routes');
const otpRoutes = require('./Holder1/Routes/otp.routes');

const app = express();
const PORT = process.env.PORT || 3000;

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
