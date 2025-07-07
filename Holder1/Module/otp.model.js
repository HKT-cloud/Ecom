const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true
    },
    otp: {
        type: String,
        required: true,
        index: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: true
    },
    purpose: {
        type: String,
        enum: ['login', 'signup', 'reset'],
        required: true,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
