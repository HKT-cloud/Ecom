const UserModel = require("../Module/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Login handler
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: "Email is not registered"
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials",
                error: "Incorrect password"
            });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Signup handler
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ 
                message: "Please fill up all credentials",
                error: "Missing required fields"
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: "Invalid email format",
                error: "Please provide a valid email address"
            });
        }

        // Check if user exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                message: "User already exists",
                error: "Email is already registered"
            });
        }

        // Hash password
        try {
            const hash = await bcrypt.hash(password, 10);
            
            // Create user
            const user = await UserModel.create({
                name,
                email,
                password: hash
            });

            // Generate token
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', {
                expiresIn: '24h'
            });

            res.status(201).json({
                message: 'User created successfully',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (hashError) {
            console.error('Password hashing error:', hashError);
            throw new Error('Failed to create user account');
        }
    } catch (error) {
        console.error('Signup error:', error);
        const errorMessage = error.message || 'Internal server error';
        
        // Return specific error messages for known errors
        if (error.message.includes('MongoError')) {
            return res.status(500).json({
                message: 'Database error occurred',
                error: errorMessage
            });
        }
        
        return res.status(500).json({
            message: errorMessage,
            error: error.message
        });
    }
};

// Logout handler
exports.logout = (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie('token', {
            path: '/',
            domain: process.env.NODE_ENV === 'production' ? '.ecomexpress-0dc3.onrender.com' : undefined
        });
        
        res.status(200).json({
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            message: 'Failed to logout'
        });
    }
};

module.exports = router;