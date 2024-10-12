const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); // Import your auth middleware

router.post('/', authMiddleware, async (req, res) => {
    // Clear the JWT token cookie by setting its expiration date to the past
    res.clearCookie('token', {
        httpOnly: true,  // Make sure the cookie is not accessible via JavaScript
        secure: false,    // Ensure the cookie is only sent over HTTPS (if applicable)
        sameSite: 'none', // Prevent CSRF attacks
    });

    // // Redirect to login page
    //  return res.redirect('/login');
});

module.exports = router;