const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../Module/user.model');
const OTPModel = require('../Module/otp.model');
const nodemailer = require('nodemailer');

// Configure transporter with better error handling
const createTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        },
        tls: {
            rejectUnauthorized: false // For self-signed certificates (use only in development)
        }
    });
};

const transporter = createTransporter();

// Verify SMTP connection with better error handling
transporter.verify(function(error, success) {
    if (error) {
        console.error('SMTP connection error:', {
            error: error.message,
            code: error.code,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
    } else {
        console.log('SMTP connection verified at', new Date().toISOString());
    }
});

exports.generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP:', {
        otp: otp.substring(0, 2) + '****', // Mask OTP in logs for security
        timestamp: new Date().toISOString()
    });
    return otp;
};

exports.sendOTP = async (req, res) => {
    const { email, purpose } = req.body;
    
    try {
        // Input validation
        if (!email || !purpose) {
            console.error('Missing required fields:', { email, purpose });
            return res.status(400).json({
                success: false,
                message: 'Email and purpose are required',
                error: 'MISSING_FIELDS'
            });
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format',
                error: 'INVALID_EMAIL'
            });
        }

        const validPurposes = ['login', 'signup', 'password_reset'];
        if (!validPurposes.includes(purpose.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP purpose',
                error: 'INVALID_PURPOSE'
            });
        }

        // Check if user exists for login purpose
        if (purpose === 'login') {
            const user = await UserModel.findOne({ email: email.toLowerCase() });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'No account found with this email',
                    error: 'USER_NOT_FOUND'
                });
            }
        }

        // Generate OTP
        const otp = this.generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

        // Save OTP to database
        await OTPModel.findOneAndUpdate(
            { email: email.toLowerCase() },
            { 
                email: email.toLowerCase(),
                otp,
                expiresAt,
                purpose: purpose.toLowerCase(),
                verified: false
            },
            { upsert: true, new: true }
        );

        // Send email with OTP
        const mailOptions = {
            from: `"Ecom Express" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Your OTP for ${purpose}`,
            text: `Your OTP is: ${otp}\nThis OTP is valid for 10 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Your OTP for ${purpose}</h2>
                    <p>Please use the following OTP to complete your ${purpose} process:</p>
                    <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
                        <h1 style="margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                    </div>
                    <p>This OTP is valid for 10 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            `
        };

        // Send email with error handling
        await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', {
                        error: error.message,
                        code: error.code,
                        stack: error.stack,
                        email: email,
                        timestamp: new Date().toISOString()
                    });
                    reject(error);
                } else {
                    console.log('Email sent:', {
                        messageId: info.messageId,
                        email: email,
                        timestamp: new Date().toISOString()
                    });
                    resolve(info);
                }
            });
        });

        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            data: {
                email: email,
                purpose: purpose,
                expiresAt: expiresAt
            }
        });

    } catch (error) {
        console.error('Error in sendOTP:', {
            error: error.message,
            stack: error.stack,
            email: email,
            purpose: purpose,
            timestamp: new Date().toISOString()
        });

        return res.status(500).json({
            success: false,
            message: 'Failed to send OTP',
            error: 'INTERNAL_SERVER_ERROR',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp, purpose } = req.body;
        
        if (!email || !otp || !purpose) {
            if (!res) {
                throw new Error('Email and purpose are required');
            }
            return res.status(400).json({
                message: 'Invalid request',
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
            
            if (!res) {
                throw new Error('Email and purpose are required');
            }
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
        if (!res) {
            throw new Error('Failed to verify OTP');
        }
        return res.status(500).json({
            error: 'Failed to verify OTP'
        });
    }
};
