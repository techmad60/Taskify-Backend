const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

// POST: User login
router.post('/', async (req, res) => {
    console.log("Login attempt:", req.body); // Log incoming request
    const { email, password } = req.body;

    // Validate the input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Check if the user is verified
        if (!user.isVerified) {
            return res.status(403).json({ message: 'User not verified. Please check your email to verify your account.' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Issue JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // Set token in an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: false,   // Cookie is not accessible via JavaScript (prevents XSS)
            secure: process.env.NODE_ENV === 'production', // Set secure flag in production (requires HTTPS)
            sameSite: 'strict', // Helps prevent CSRF attacks
            maxAge: 60 * 60 * 1000, // Token expires in 1 hour
        });

        // Send a single response
        res.json({ token, message: 'Login successful' }); // Send success message only
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
