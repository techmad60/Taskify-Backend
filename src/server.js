// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/tasks');
const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const verifyEmailRoutes = require('./routes/verifyEmail');
const resetPasswordRoutes = require('./routes/resetPassword'); // Import reset password routes
const requestResetRoutes = require('./routes/requestReset'); // Import request reset routes
const logoutRoutes = require('./routes/logout')
const allowedOrigins = require('./allowedOrigins');


const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config(); // To load the .env variables

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies from incoming requests

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

//Routes
app.use('/api/signup', signupRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/verify-email', verifyEmailRoutes);
app.use('/api/request-reset', requestResetRoutes); // Add request reset routes
app.use('/api/reset-password', resetPasswordRoutes); // Add reset password routes
app.use('/api/logout', logoutRoutes); // Add reset password routes

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
    console.error(err.stack); // Log error stack for debugging
    res.status(500).json({ message: err.message }); // Send a generic error response
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
