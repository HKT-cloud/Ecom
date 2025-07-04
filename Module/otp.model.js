const mongoose = require('mongoose')
const crypto = require('crypto')

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        required: true,
        enum: ['signup', 'signin']
    },
    expiresAt: {
        type: Date,
        required: true
    },
    used: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

// Generate OTP
OTPSchema.statics.generateOTP = async function(email, purpose) {
    try {
        // First check if there's an existing valid OTP
        const existingOTP = await this.findOne({
            email,
            purpose,
            used: false,
            expiresAt: { $gt: new Date() }
        })

        if (existingOTP) {
            // If an existing valid OTP exists, return it instead of generating a new one
            return existingOTP
        }

        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

        // Delete any expired OTPs for this email and purpose
        await this.deleteMany({ 
            email, 
            purpose,
            expiresAt: { $lte: new Date() }
        })

        return this.create({
            email,
            otp,
            purpose,
            expiresAt
        })
    } catch (error) {
        console.error('OTP generation error:', error)
        throw new Error('Failed to generate OTP')
    }
}

// Verify OTP
OTPSchema.statics.verifyOTP = async function(email, otp, purpose) {
    try {
        const otpRecord = await this.findOne({
            email,
            otp,
            purpose,
            used: false,
            expiresAt: { $gt: new Date() }
        })

        if (!otpRecord) {
            // Check if there's an expired OTP
            const expiredOTP = await this.findOne({
                email,
                otp,
                purpose,
                expiresAt: { $lte: new Date() }
            })
            
            if (expiredOTP) {
                throw new Error('OTP has expired')
            }
            
            throw new Error('Invalid OTP')
        }

        // Mark OTP as used
        otpRecord.used = true
        await otpRecord.save()

        return otpRecord
    } catch (error) {
        console.error('OTP verification error:', error)
        throw error
    }
}

const OTPModel = mongoose.model('OTP', OTPSchema)

module.exports = OTPModel
