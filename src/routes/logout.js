const express = require('express');
const router = express.Router()

router.post('/', (req, res) => {
    // Clear the JWT token cookie by setting its expiration date to the past
    res.clearCookie('token', {
        httpOnly: true,  // Make sure the cookie is not accessible via JavaScript
        secure: true,    // Ensure the cookie is only sent over HTTPS (if applicable)
        sameSite: 'none', // Prevent CSRF attacks
    });

    // Redirect to login page
     return res.redirect('/login');
});

module.exports = router;