const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const router = express.Router();

// Setup Nodemailer transporter (use your SMTP or email service provider)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL, // Your email
        pass: process.env.EMAIL_PASSWORD // Your email password or app password
    }
});

// Function to send verification email
const sendVerificationEmail = (email, token) => {
    const verificationLink = `${process.env.REACT_APP_API_URL}/api/verify-email?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Verify your email',
        text: `Click on the following link to verify your email: ${verificationLink}`,
        html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
    };

    return transporter.sendMail(mailOptions);
};

// POST: Register a new user
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    // Validate the input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the new user but mark them as unverified
        const user = new User({ email, password: hashedPassword, isVerified: false });
        await user.save();

        // Generate a verification token (valid for 1 hour)
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send verification email
        await sendVerificationEmail(email, token);

        res.status(201).json({ message: 'User registered successfully! Please check your email to verify your account.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
