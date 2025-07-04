const nodemailer = require('nodemailer')
const OTPModel = require('../Module/otp.model')
const UserModel = require('../Module/user.model')

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hthesiya24@gmail.com',
        pass: 'qygt iogi pmsb ujgk'
    }
})

exports.sendOTP = async (req, res) => {
    try {
        const { email, purpose } = req.body
        
        // Generate OTP
        const otp = await OTPModel.generateOTP(email, purpose)

        // Send OTP via email
        const mailOptions = {
            from: 'hthesiya24@gmail.com',
            to: email,
            subject: purpose === 'signup' ? 'Sign Up Verification' : 'Sign In Verification',
            text: `Your ${purpose} OTP is: ${otp.otp}. This OTP will expire in 5 minutes.`
        }

        await transporter.sendMail(mailOptions)

        res.status(200).json({ message: 'OTP sent successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp, purpose } = req.body
        
        // Verify OTP
        const verifiedOTP = await OTPModel.verifyOTP(email, otp, purpose)

        // Return success response
        res.status(200).json({ 
            success: true,
            message: 'OTP verified successfully'
        })
    } catch (error) {
        // Log the error for debugging
        console.error('OTP verification failed:', error)
        res.status(400).json({ 
            success: false,
            error: error.message 
        })
    }
}
