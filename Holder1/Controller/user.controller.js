const UserModel = require("../Module/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ✅ Login handler
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                message: "Please provide email and password",
                error: "Missing required fields"
            });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            console.log(`User not found for email: ${email}`);
            return res.status(404).json({ 
                message: "User not found",
                error: "User does not exist"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`Incorrect password for user: ${user._id}`);
            return res.status(401).json({ 
                message: "Invalid credentials",
                error: "Incorrect password"
            });
        }

        const jwtSecret = process.env.JWT_SECRET || "your-secret-key-here";
        if (!jwtSecret) {
            console.error("JWT_SECRET not configured in environment variables");
            return res.status(500).json({ 
                message: "Server configuration error",
                error: "JWT secret not configured"
            });
        }

        const token = jwt.sign({ userId: user._id }, jwtSecret, {
            expiresIn: "1h",
        });

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        console.error("Login error:", {
            error: err.message,
            stack: err.stack,
            request: req.body
        });
        
        // Don't expose sensitive error details to client
        return res.status(500).json({ 
            message: "Internal server error",
            error: "An unexpected error occurred"
        });
    }
};

// ✅ Signup handler
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ 
                message: "Validation error",
                error: "All fields (name, email, password) are required"
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: "Validation error",
                error: "Please provide a valid email address"
            });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({ 
                message: "Validation error",
                error: "Password must be at least 6 characters long"
            });
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                message: "Email already registered",
                error: "This email is already in use"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        const user = new UserModel({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        // Generate JWT token
        const jwtSecret = process.env.JWT_SECRET || "your-secret-key-here";
        if (!jwtSecret) {
            console.error("JWT_SECRET not configured in environment variables");
            return res.status(500).json({ 
                message: "Server configuration error",
                error: "JWT secret not configured"
            });
        }

        const token = jwt.sign({ userId: user._id }, jwtSecret, {
            expiresIn: "1h",
        });

        return res.status(201).json({
            message: "Signup successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        console.error("Signup error:", {
            error: err.message,
            stack: err.stack,
            request: req.body
        });
        
        // Don't expose sensitive error details to client
        return res.status(500).json({ 
            message: "Internal server error",
            error: "An unexpected error occurred"
        });
    }
};

// ✅ Logout handler
const logout = (req, res) => {
    try {
        res.clearCookie("token", {
            path: "/",
            domain: process.env.NODE_ENV === "production" ? ".yourdomain.com" : undefined,
        });

        return res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Logout failed" });
    }
};

module.exports = {
    login,
    signup,
    logout
};
