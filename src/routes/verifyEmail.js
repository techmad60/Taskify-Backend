const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// GET: Verify the user's email
router.get('/', async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: 'No token provided.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find the user by ID
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update the user's isVerified field
        user.isVerified = true;
        await user.save();

        // Redirect to welcome page or send a success message
        res.redirect('http://localhost:3000/welcome'); // Redirect to your frontend welcome page
    } catch (err) {
        return res.status(500).json({ message: 'Invalid or expired token.' });
    }
});

module.exports = router;
