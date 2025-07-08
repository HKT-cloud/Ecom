const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../Module/user.model');
const OTPModel = require('../Module/otp.model');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // for STARTTLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
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
        if (!validPurposes.includes(purpose.toLowerCase())) {
            console.error('Invalid OTP purpose:', purpose);
            return res.status(400).json({
                message: 'Invalid OTP purpose',
                error: 'Purpose must be one of: login, signup, password_reset'
            });
        }

        // Check if user exists for login/password_reset purposes
        if (purpose !== 'signup') {
            const user = await UserModel.findOne({ email: email.toLowerCase() });
            if (!user && purpose === 'login') {
                return res.status(400).json({
                    message: 'Invalid credentials',
                    error: 'No account found with this email'
                });
            }
        }

        // Check if user exists for login/signup
        if (purpose === 'login' || purpose === 'signup') {
            const user = await UserModel.findOne({ email: email.toLowerCase() });
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

        // Generate OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Send email with enhanced error handling

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

        // Convert email to lowercase for consistent matching
        const lowerCaseEmail = email.toLowerCase();
        
        // Log verification parameters
        console.log('Verifying OTP with:', {
            email: lowerCaseEmail,
            otp: otp.trim(),
            purpose,
            currentTimestamp: new Date().toISOString()
        });

        // Log all OTPs in database before verification
        const allOtps = await OTPModel.find({ email: lowerCaseEmail }).sort({ createdAt: -1 });
        console.log('All OTPs in DB for verification:', allOtps.map(otp => ({
            _id: otp._id,
            otp: otp.otp,
            purpose: otp.purpose,
            expiresAt: otp.expiresAt.toISOString(),
            createdAt: otp.createdAt.toISOString()
        })));

        // Log search parameters for MongoDB
        console.log('MongoDB search parameters:', {
            email: lowerCaseEmail,
            otp: otp.trim(),
            purpose,
            expiresAt: { $gt: new Date() }
        });

        const otpRecord = await OTPModel.findOne({
            email: lowerCaseEmail,
            otp: otp.trim(),
            purpose,
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            // Log all OTPs for this user to help debug
            const allOtps = await OTPModel.find({ email: lowerCaseEmail }).sort({ createdAt: -1 });
            console.log('Found OTPs for debugging:', allOtps.map(otp => ({
                _id: otp._id,
                otp: otp.otp,
                purpose: otp.purpose,
                expiresAt: otp.expiresAt.toISOString(),
                createdAt: otp.createdAt.toISOString()
            })));
            
            // Log current time and search parameters
            console.error('OTP verification failed:', {
                currentTime: new Date().toISOString(),
                searchParams: {
                    email: lowerCaseEmail,
                    otp: otp.trim(),
                    purpose,
                    expiresAt: { $gt: new Date() }
                }
            });
            
            return res.status(400).json({
                error: 'Invalid or expired OTP',
                debug: {
                    currentTime: new Date().toISOString(),
                    searchParams: {
                        email: lowerCaseEmail,
                        otp: otp.trim(),
                        purpose,
                        expiresAt: { $gt: new Date() }
                    }
                }
            });
        }

        // Delete the used OTP
        await OTPModel.findByIdAndDelete(otpRecord._id);

        // Generate JWT token for login
        if (purpose === 'login') {
            const user = await UserModel.findOne({ email: lowerCaseEmail });
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
