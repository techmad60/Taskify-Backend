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
            httpOnly: true,
            secure: true, // Only send the cookie over HTTPS
            sameSite: 'none', // Allows cross-origin requests when credentials are sent
            maxAge: 60 * 60 * 1000, // Token expires in 1 hour
        });
        
        console.log('Token set in cookie:', token); 
        // Send a single response
        res.json({ message: 'Login successful' }); // Send success message only
        //res.json({ token }); // Send success message only
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
