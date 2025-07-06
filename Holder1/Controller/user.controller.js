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

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = await UserModel.create({ name, email, password: hash });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secret", {
            expiresIn: "24h",
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
        console.error("Signup error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
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
