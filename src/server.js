// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/tasks');
const cors = require('cors');
require('dotenv').config(); // To load the .env variables

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000'  // Only allow requests from this origin
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

// Use task routes
app.use('/api/tasks', taskRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
