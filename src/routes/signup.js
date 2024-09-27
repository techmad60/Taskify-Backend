const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const router = express.Router();

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL, // Your email
        pass: process.env.EMAIL_PASSWORD // Your app password
    }
});

// Function to send verification email
const sendVerificationEmail = (email, token) => {
    const verificationLink = `http://localhost:5000/api/verify-email?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Verify your email',
        text: `Click on the following link to verify your email: ${verificationLink}`,
        html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
    };

    return transporter.sendMail(mailOptions);
};

// POST: Register a new user (without saving to DB)
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Generate a verification token (contains email and password, valid for 1 hour)
        const token = jwt.sign({ email, password: hashedPassword }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send verification email
        await sendVerificationEmail(email, token);

        res.status(201).json({ message: 'User registered successfully! Please check your email to verify your account.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

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
