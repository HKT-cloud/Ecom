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

exports.generateOTP = () => {
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

exports.sendOTP = async (req, res) => {
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

        const validPurposes = ['login', 'signup', 'password_reset'];
        if (!validPurposes.includes(purpose.toLowerCase())) {
            console.error('Invalid OTP purpose:', purpose);
            return res.status(400).json({
                message: 'Invalid OTP purpose',
                error: 'Purpose must be one of: login, signup, password_reset'
            });
        }

        if (purpose !== 'signup') {
            const user = await UserModel.findOne({ email: email.toLowerCase() });
            if (!user && purpose === 'login') {
                return res.status(400).json({
                    message: 'Invalid credentials',
                    error: 'No account found with this email'
                });
            }
        }

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
        const otp = exports.generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Log OTP before saving
        console.log('Generated OTP:', {
            otp,
            type: typeof otp,
            length: otp.length,
            timestamp: new Date().toISOString()
        });

        // Save OTP to database
        const otpRecord = new OTPModel({
            email: email.toLowerCase(),
            otp,
            expiresAt,
            purpose
        });

        try {
            await otpRecord.save();
            console.log('OTP saved successfully:', {
                _id: otpRecord._id,
                email: otpRecord.email,
                otp: otpRecord.otp,
                purpose: otpRecord.purpose,
                expiresAt: otpRecord.expiresAt.toISOString(),
                timestamp: new Date().toISOString()
            });

            // Send email with OTP
            const mailOptions = {
                from: process.env.SMTP_USER,
                to: email,
                subject: `Your ${purpose === 'login' ? 'Login' : 'Verification'} OTP`,
                text: `Your ${purpose === 'login' ? 'Login' : 'Verification'} OTP is: ${otp}\n\nThis OTP will expire in 5 minutes. Please do not share it with anyone.`,
                html: `
                    <p>Your ${purpose === 'login' ? 'Login' : 'Verification'} OTP is: <strong>${otp}</strong></p>
                    <p>This OTP will expire in 5 minutes. Please do not share it with anyone.</p>
                `
            };

            try {
                await transporter.sendMail(mailOptions);
                console.log('OTP email sent successfully:', {
                    to: email,
                    purpose,
                    timestamp: new Date().toISOString()
                });

                // Return success response
                return res.json({
                    message: 'OTP sent successfully',
                    email: email,
                    expiresAt: expiresAt
                });
            } catch (mailError) {
                console.error('Email sending failed:', mailError);
                
                // Clean up the OTP record if email sending fails
                await OTPModel.findByIdAndDelete(otpRecord._id);
                
                return res.status(500).json({
                    message: 'Failed to send OTP',
                    error: 'Failed to send email'
                });
            }
        } catch (saveError) {
            console.error('OTP saving failed:', saveError);
            return res.status(500).json({
                error: 'Failed to save OTP'
            });
        }
    } catch (error) {
        console.error('Send OTP error:', error);
        if (!res) {
            throw new Error('Failed to send OTP');
        }
        return res.status(500).json({
            error: 'Failed to send OTP'
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

module.exports = {
    sendOTP: exports.sendOTP,
    verifyOTP: exports.verifyOTP
};
