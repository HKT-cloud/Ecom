const express = require('express');
const otpController = require('../Controller/otp.controller');

const router = express.Router();

// Send OTP
router.post('/send-otp', otpController.sendOTP);

// Verify OTP
router.post('/verify-otp', otpController.verifyOTP);

module.exports = router;
