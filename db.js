const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('MongoDB URI:', process.env.MONGODB_URI);
        
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('MongoDB Connected Successfully!');
        console.log('MongoDB Host:', conn.connection.host);
        console.log('MongoDB Name:', conn.connection.name);
        
        return conn;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        console.error('MongoDB connection error details:', error.stack);
        
        // Check for specific connection errors
        if (error.message.includes('failed to connect')) {
            console.error('Failed to connect to MongoDB. Please ensure MongoDB is running and accessible.');
        } else if (error.message.includes('authentication')) {
            console.error('MongoDB authentication failed. Please check your credentials.');
        }
        
        throw new Error('Failed to connect to MongoDB');
    }
};

module.exports = connectDB;