// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/tasks');
const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
//const verifyEmailRoutes = require('./routes/verifyEmail');
const allowedOrigins = require('./allowedOrigins');
const cors = require('cors');

require('dotenv').config(); // To load the .env variables

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));


// Middleware
app.use(express.json());

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
//app.use('/api/verify-email', verifyEmailRoutes);


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
