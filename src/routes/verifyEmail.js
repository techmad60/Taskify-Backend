const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// GET: Verify email (to save user to DB)
router.get('/verify-email', async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: 'Verification token is missing.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user already exists
        const existingUser = await User.findOne({ email: decoded.email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already verified.' });
        }

        // Save the user to the database
        const newUser = new User({ email: decoded.email, password: decoded.password, isVerified: true });
        await newUser.save();

        res.redirect('http://taskify-ten-hazel.vercel.app/welcome'); // Redirect to your frontend welcome page
    } catch (err) {
        res.status(400).json({ message: 'Invalid or expired token.' });
    }
});


module.exports = router;
