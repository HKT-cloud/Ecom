const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../Module/user.model');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                message: "Please provide email and password",
                error: "Missing required fields"
            });
        }

        // Convert email to lowercase to match database
        const userEmail = email.toLowerCase();
        const user = await UserModel.findOne({ email: userEmail }).select('+password');
        
        if (!user) {
            return res.status(401).json({ 
                message: "Invalid credentials",
                error: "Invalid email or password"
            });
        }

        // Log the password comparison for debugging
        console.log('Comparing password:', password);
        console.log('Stored hash:', user.password);
        
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ 
                message: "Invalid credentials",
                error: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ 
                message: "Please provide all required fields",
                error: "Missing required fields"
            });
        }

        // Convert email to lowercase before checking and saving
        const userEmail = email.toLowerCase();
        const existingUser = await UserModel.findOne({ email: userEmail });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered",
                error: "User already exists"
            });
        }

        const user = new UserModel({
            name,
            email: userEmail,
            password
        });

        await user.save();

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};

module.exports = {
    login,
    signup,
    logout
};
