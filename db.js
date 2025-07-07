const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        // MongoDB connection string from environment
        const MONGODB_URI = process.env.MONGODB_URI;
        
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI is not set in environment variables');
        }
        
        console.log('Connecting to MongoDB...');
        console.log('MongoDB URI:', MONGODB_URI);

        const conn = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000, // 10 second timeout
            socketTimeoutMS: 45000, // 45 second socket timeout
            keepAlive: true,
            connectTimeoutMS: 30000, // 30 second connection timeout
            authSource: 'admin', // Specify auth source
            retryWrites: true,
            w: 'majority'
        });

        console.log('MongoDB Connected Successfully!');
        console.log('MongoDB Host:', conn.connection.host);
        console.log('MongoDB Name:', conn.connection.name);
        console.log('MongoDB DB:', conn.connection.name);

        // Add connection error event listener
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        // Add connection disconnected event listener
        mongoose.connection.on('disconnected', () => {
            console.error('MongoDB connection disconnected');
        });

        return conn;
    } catch (error) {
        console.error('MongoDB connection error:', {
            message: error.message,
            stack: error.stack,
            type: error.name,
            code: error.code
        });

        // Check for specific connection errors
        if (error.message.includes('failed to connect')) {
            console.error('Failed to connect to MongoDB. Please ensure MongoDB is running and accessible.');
            console.error('Connection string:', process.env.MONGODB_URI);
        } else if (error.message.includes('authentication')) {
            console.error('MongoDB authentication failed. Please check your credentials.');
            console.error('Database name:', process.env.MONGODB_URI.split('/').pop());
        } else if (error.message.includes('timeout')) {
            console.error('MongoDB connection timeout. Please check your network connection.');
            console.error('Timeout settings:', {
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000,
                connectTimeoutMS: 30000
            });
        }

        throw new Error('Failed to connect to MongoDB. Please check the logs for details.');
    }
};

module.exports = connectDB;