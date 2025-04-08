const User = require('../models/User')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { sanitize } = require('express-mongo-sanitize')
const bcrypt = require('bcryptjs')

//generating jwt
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "10h" }
    )
}

//register User
exports.registerUser = async (req, res) => {
    try {
        // Sanitize request body to prevent NoSQL injection
        sanitize(req.body)
        const { fullName, email, password, profileImageUrl } = req.body

        // Validate required fields
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        // Additional password strength requirements
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            });
        }

        // Validate fullName length
        const sanitizedFullName = fullName.trim();
        if (sanitizedFullName.length < 2 || sanitizedFullName.length > 50) {
            return res.status(400).json({ message: "Full name must be between 2 and 50 characters" });
        }

        //checking is email already present
        const existingUser = await User.findOne({ email: email.toLowerCase() })
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" })
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //creating the user
        const user = await User.create({
            fullName: sanitizedFullName,
            email: email.toLowerCase(),
            password: hashedPassword,
            profileImageUrl: profileImageUrl ? profileImageUrl.trim() : undefined
        })

        res.status(201).json({
            id: user._id,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                profileImageUrl: user.profileImageUrl
            },
            token: generateToken(user._id)
        })

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Error registering user", error: error.message })
    }
}

//login user
exports.loginUser = async (req, res) => {
    try {
        // Sanitize request body to prevent NoSQL injection
        sanitize(req.body)
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({ email: email.toLowerCase() })
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        res.status(200).json({
            id: user._id,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                profileImageUrl: user.profileImageUrl
            },
            token: generateToken(user._id)
        })
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message })
    }
}

//get user info
exports.getUserInfo = async (req, res) => {
    try {
        const userId = req.user.id

        // Validate userId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const user = await User.findById(new mongoose.Types.ObjectId(userId))
            .select("-password -__v -createdAt -updatedAt")

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: "Error fetching user info", error: error.message })
    }
}