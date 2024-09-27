const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

// POST: Reset password
router.post('/', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Find the user by the reset token and ensure the token hasn't expired
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }, // Check if the token is not expired
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Hash the new password
        user.password = await bcrypt.hash(newPassword, 10); // You can adjust the salt rounds if needed
        user.passwordResetToken = undefined; // Clear the reset token
        user.passwordResetExpires = undefined; // Clear the expiration
        await user.save(); // Save the updated user

        res.json({ message: 'Password has been reset successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error resetting password' });
    }
});

module.exports = router;
