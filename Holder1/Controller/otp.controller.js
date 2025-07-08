const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../Module/user.model');
const OTPModel = require('../Module/otp.model');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
    port: process.env.SMTP_PORT || 587,
    secure: true,
    auth: {
        user: process.env.SENDGRID_USERNAME || 'apikey',
        pass: process.env.SENDGRID_API_KEY
    }
});

// Verify SMTP connection
transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP connection error:', error);
        throw new Error('Failed to verify SMTP connection');
    }
    console.log('SMTP connection verified');
});

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (req, res) => {
    try {
        const { email, purpose } = req.body;
        
        // Validate required fields
        if (!email || !purpose) {
            console.error('Invalid OTP request:', { email, purpose });
            return res.status(400).json({
                message: 'Invalid request',
                error: 'Email and purpose are required'
            });
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            console.error('Invalid email format:', email);
            return res.status(400).json({
                message: 'Invalid email',
                error: 'Please provide a valid email address'
            });
        }

        // Validate OTP purpose
        const validPurposes = ['login', 'signup', 'password_reset'];
        if (!validPurposes.includes(purpose)) {
            console.error('Invalid OTP purpose:', purpose);
            return res.status(400).json({
                message: 'Invalid OTP purpose',
                error: 'Purpose must be one of: login, signup, password_reset'
            });
        }

        // Check if user exists for login/password_reset purposes
        if (purpose !== 'signup') {
            const user = await UserModel.findOne({ email });
            if (!user && purpose === 'login') {
                return res.status(400).json({
                    message: 'Invalid credentials',
                    error: 'No account found with this email'
                });
            }
        }

        // Validate purpose
        if (!['login', 'signup', 'reset'].includes(purpose)) {
            console.error('Invalid OTP purpose:', purpose);
            return res.status(400).json({
                message: 'Invalid purpose',
                error: 'Invalid OTP purpose'
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

        // Send email with enhanced error handling
        const mailOptions = {
            from: process.env.FROM_EMAIL || 'noreply@ecomexpress.com',
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${otp}. This code will expire in 5 minutes.`
        };

        try {
            // First clean up any existing OTP records for this email and purpose
            await OTPModel.deleteMany({
                email,
                purpose,
                $or: [
                    { expiresAt: { $lt: new Date() } },
                    { createdAt: { $lt: new Date(Date.now() - 5 * 60 * 1000) } }
                ]
            });

            // Send email with enhanced error handling
            await new Promise((resolve, reject) => {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Failed to send email:', error);
                        reject(error);
                    } else {
                        console.log('Email sent:', info.response);
                        resolve(info);
                    }
                });
            });

            res.json({
                message: 'OTP sent successfully',
                email: email, // Return email for frontend reference
                expiresAt: expiresAt // Return expiration time for frontend
            });
        } catch (error) {
            console.error('Email sending failed:', error);
            
            // Clean up failed OTP record
            await OTPModel.deleteOne({ _id: otpRecord._id });
            
            // Clean up any other failed attempts for this email
            await OTPModel.deleteMany({
                email,
                purpose,
                $or: [
                    { expiresAt: { $lt: new Date() } },
                    { createdAt: { $lt: new Date(Date.now() - 5 * 60 * 1000) } }
                ]
            });
            
            return res.status(500).json({
                message: 'Failed to send OTP',
                error: 'Failed to send email'
            });
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
