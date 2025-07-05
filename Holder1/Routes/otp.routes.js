const express = require('express')
const router = express.Router()
const otpController = require('../Controller/otp.controller')

// Send OTP
router.post('/send-otp', async (req, res) => {
    try {
        const { email, purpose } = req.body
        if (!email || !purpose) {
            return res.status(400).json({ error: 'Email and purpose are required' })
        }
        await otpController.sendOTP(req, res)
    } catch (error) {
        console.error('Send OTP error:', error)
        res.status(500).json({ error: 'Failed to send OTP' })
    }
})

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        await otpController.verifyOTP(req, res)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

module.exports = router
