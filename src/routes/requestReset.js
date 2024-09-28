const express = require('express');
const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const router = express.Router();

// POST: Request password reset
router.post('/', async (req, res) => {
    console.log("Received request to /api/request-reset");

    const { email } = req.body;

    try {
        // Check if the email is provided
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log(`User with email ${email} not found.`);
            return res.status(400).json({ message: 'User not found, signup!' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour expiration
        await user.save();

        // Send email with reset link (using nodemailer)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const resetUrl = `https://taskify-ten-hazel.vercel.app/reset-password`;
        await transporter.sendMail({
            to: user.email,
            subject: 'Password Reset',
            text: `You requested a password reset. Click here to reset: ${resetUrl}`,
        });

        res.json({ message: 'Reset link sent to your email' });
    } catch (err) {
        console.error("Error in request-reset:", err); // Log error for debugging
        res.status(500).json({ message: 'Error sending reset email' });
    }
});

module.exports = router;
