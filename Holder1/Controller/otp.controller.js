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
    // Generate 6-digit OTP as string
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP:', {
        otp,
        type: typeof otp,
        length: otp.length,
        timestamp: new Date().toISOString()
    });
    return otp;
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

        // Log OTP before saving
        console.log('Saving OTP to DB:', {
            email: email.toLowerCase(),
            otp,
            purpose,
            expiresAt: expiresAt.toISOString(),
            otpType: typeof otp,
            otpLength: otp.length,
            timestamp: new Date().toISOString()
        });

        // Save OTP to database
        const otpRecord = new OTPModel({
            email: email.toLowerCase(),
            otp,
            expiresAt,
            purpose
        });
        await otpRecord.save();

        // Log saved OTP record
        console.log('OTP saved successfully:', {
            _id: otpRecord._id,
            email: otpRecord.email,
            otp: otpRecord.otp,
            purpose: otpRecord.purpose,
            expiresAt: otpRecord.expiresAt.toISOString(),
            createdAt: otpRecord.createdAt.toISOString()
        });

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
        console.log('🔍 Attempting to verify OTP with:', {
            email: lowerCaseEmail,
            otp: otp, // Log the exact OTP value received
            otpType: typeof otp,
            otpLength: otp.length,
            purpose,
            currentTime: new Date().toISOString()
        });

        // Convert OTP to string if it's not already
        const otpString = String(otp).trim(); // Explicitly trim spaces
        console.log('🔄 Converting OTP to string:', {
            original: otp,
            converted: otpString,
            originalType: typeof otp,
            convertedType: typeof otpString,
            originalLength: otp.length,
            convertedLength: otpString.length,
            timestamp: new Date().toISOString()
        });

        // Log all OTPs in database before verification
        const allOtps = await OTPModel.find({ email: lowerCaseEmail }).sort({ createdAt: -1 });
        console.log('📄 All OTPs in DB for verification:', allOtps.map(dbOtp => ({
            _id: dbOtp._id,
            otp: dbOtp.otp,
            purpose: dbOtp.purpose,
            expiresAt: dbOtp.expiresAt.toISOString(),
            createdAt: dbOtp.createdAt.toISOString(),
            otpType: typeof dbOtp.otp,
            otpLength: dbOtp.otp.length,
            expiresAtTimestamp: dbOtp.expiresAt.getTime()
        })));

        // Log search parameters for MongoDB
        console.log('🔍 MongoDB search parameters:', {
            email: lowerCaseEmail,
            otp: otpString, // Use the converted string
            purpose,
            expiresAt: { $gt: new Date() },
            currentTime: new Date().toISOString(),
            timestamp: new Date().toISOString(),
            currentTimeTimestamp: new Date().getTime()
        });

        // Add a check for exact OTP match
        const matchingOtps = allOtps.filter(dbOtp => 
            dbOtp.otp === otpString && 
            dbOtp.purpose === purpose && 
            dbOtp.expiresAt > new Date()
        );
        
        console.log('🔍 Matching OTPs found:', matchingOtps.map(match => ({
            _id: match._id,
            otp: match.otp,
            purpose: match.purpose,
            expiresAt: match.expiresAt.toISOString(),
            createdAt: match.createdAt.toISOString(),
            expiresAtTimestamp: match.expiresAt.getTime()
        })));

        const otpRecord = matchingOtps[0] || await OTPModel.findOne({
            email: lowerCaseEmail,
            otp: otpString, // Use the converted string
            purpose,
            expiresAt: { $gt: new Date() }
        });

        // Log the result of the query
        console.log('📄 OTP record found:', otpRecord ? {
            _id: otpRecord._id,
            email: otpRecord.email,
            otp: otpRecord.otp,
            purpose: otpRecord.purpose,
            expiresAt: otpRecord.expiresAt.toISOString(),
            createdAt: otpRecord.createdAt.toISOString()
        } : null);

        if (!otpRecord) {
            // Log all OTPs for this user to help debug
            const allOtps = await OTPModel.find({ email: lowerCaseEmail }).sort({ createdAt: -1 });
            console.log('Found OTPs for debugging:', allOtps.map(dbOtp => ({
                _id: dbOtp._id,
                otp: dbOtp.otp,
                purpose: dbOtp.purpose,
                expiresAt: dbOtp.expiresAt.toISOString(),
                createdAt: dbOtp.createdAt.toISOString(),
                otpType: typeof dbOtp.otp,
                otpLength: dbOtp.otp.length,
                expiresAtTimestamp: dbOtp.expiresAt.getTime()
            })));
            
            // Log current time and search parameters
            console.error('OTP verification failed:', {
                timestamp: new Date().toISOString(),
                searchParams: {
                    email: lowerCaseEmail,
                    otp: otpString, // Use the converted string
                    purpose,
                    expiresAt: { $gt: new Date() },
                    currentTime: new Date().toISOString(),
                    currentTimeTimestamp: new Date().getTime()
                }
            });
            
            return res.status(400).json({
                success: false,
                error: 'Invalid or expired OTP',
                debug: {
                    timestamp: new Date().toISOString(),
                    searchParams: {
                        email: lowerCaseEmail,
                        otp: otpString, // Use the converted string
                        purpose,
                        expiresAt: { $gt: new Date() },
                        currentTime: new Date().toISOString(),
                        currentTimeTimestamp: new Date().getTime()
                    }
                }
            });
        }

        // Delete the used OTP
        await OTPModel.findByIdAndDelete(otpRecord._id);

        // Generate JWT token for login
        if (purpose === 'login') {
            // Generate JWT token
            const token = jwt.sign({ userId: otpRecord.email }, process.env.JWT_SECRET || 'your-secret-key', {
                expiresIn: '24h'
            });

            return res.status(200).json({
                success: true,
                message: 'OTP verified successfully',
                token,
                user: {
                    id: otpRecord.email,
                    email: otpRecord.email
                }
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
