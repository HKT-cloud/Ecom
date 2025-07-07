const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../Module/user.model');
const OTPModel = require('../Module/otp.model');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

// Verify SMTP connection
try {
    await transporter.verify();
    console.log('SMTP connection verified');
} catch (error) {
    console.error('SMTP connection error:', error);
    throw new Error('Failed to verify SMTP connection');
}

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (req, res) => {
    try {
        const { email, purpose } = req.body;
        
        if (!email || !purpose) {
            return res.status(400).json({
                error: 'Email and purpose are required'
            });
        }

        // Check if user exists for login/signup
        if (purpose === 'login' || purpose === 'signup') {
            const user = await UserModel.findOne({ email });
            if (purpose === 'login' && !user) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }
            if (purpose === 'signup' && user) {
                return res.status(400).json({
                    error: 'Email already registered'
                });
            }
        }

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Save OTP to database
        const otpRecord = new OTPModel({
            email,
            otp,
            expiresAt,
            purpose
        });
        await otpRecord.save();

        // Send email
        const mailOptions = {
            from: process.env.FROM_EMAIL || 'noreply@ecomexpress.com',
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${otp}. This code will expire in 5 minutes.`
        };

        try {
            await transporter.sendMail(mailOptions);
            
            // Clean up old OTP records for this email and purpose
            await OTPModel.deleteMany({
                email,
                purpose,
                expiresAt: { $lt: new Date() }
            });
            
            res.json({
                message: 'OTP sent successfully'
            });
        } catch (mailError) {
            console.error('Failed to send email:', mailError);
            
            // Clean up failed OTP record
            await OTPModel.deleteOne({ _id: otpRecord._id });
            
            // Also clean up any other failed attempts for this email
            await OTPModel.deleteMany({
                email,
                purpose,
                createdAt: { $lt: new Date(Date.now() - 5 * 60 * 1000) } // Remove records older than 5 minutes
            });
            
            throw new Error('Failed to send email');
        }
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({
            error: 'Failed to send OTP'
        });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp, purpose } = req.body;
        
        if (!email || !otp || !purpose) {
            return res.status(400).json({
                error: 'Email, OTP, and purpose are required'
            });
        }

        const otpRecord = await OTPModel.findOne({
            email,
            otp,
            purpose,
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            return res.status(400).json({
                error: 'Invalid or expired OTP'
            });
        }

        // Delete the used OTP
        await OTPModel.findByIdAndDelete(otpRecord._id);

        // Generate JWT token for login
        if (purpose === 'login') {
            const user = await UserModel.findOne({ email });
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            
            res.json({
                message: 'OTP verified successfully',
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name
                }
            });
        } else {
            res.json({
                message: 'OTP verified successfully'
            });
        }
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            error: 'Failed to verify OTP'
        });
    }
};

module.exports = {
    sendOTP,
    verifyOTP
};
