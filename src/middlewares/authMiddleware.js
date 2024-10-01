const jwt = require ('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    console.log('Cookies:', req.cookies); // Log cookies
    const token = req.cookies.token;

    if (!token) {
        console.log('No token found');
        return res.status(401).json({ message: 'No token, authorization denied.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log('User authenticated:', req.user); // Log authenticated user
        next();
    } catch (err) {
        console.log('Invalid token:', err.message);
        res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = authMiddleware;
