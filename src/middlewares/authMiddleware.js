const jwt = require ('jsonwebtoken');
require('dotenv').config

const authMiddleware = (req, res, next) => {
    // console.log('Cookies:', req.cookies); // Log cookies
    const token = req.cookies['token']; // Get token from cookie

    //const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        console.log('No token found');
        return res.status(401).json({ message: 'No token, authorization denied.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userId;
        console.log('User authenticated:', req.user); // Log authenticated user
        next();
    } catch (err) {
        console.log('Invalid token:', err.message);
        res.status(401).json({ message: 'Invalid token.' });
    }

};

module.exports = authMiddleware;
// const jwt = require('jsonwebtoken');
// require('dotenv').config(); // Ensure environment variables are loaded

// const authMiddleware = (req, res, next) => {
//     const authHeader = req.headers['authorization'];

//     // Check if the Authorization header exists
//     if (!authHeader) {
//         return res.status(401).json({ message: 'Authorization header missing' });
//     }

//     // Extract the token from the "Bearer <token>" string
//     const token = authHeader.split(' ')[1];

//     if (!token) {
//         console.log('No token found');
//         return res.status(401).json({ message: 'Token missing from Authorization header' });
//     }

//     // Verify the token
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded.userId; // Store user ID in the request
//         console.log('User authenticated:', req.user); // Log authenticated user
//         next(); // Pass control to the next middleware/route handler
//     } catch (err) {
//         console.log('Invalid token:', err.message);
//         return res.status(403).json({ message: 'Invalid token' });
//     }
// };

// module.exports = authMiddleware;

