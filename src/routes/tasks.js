const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middlewares/authMiddleware'); // Import your auth middleware
const router = express.Router();




// Create a new task (only for authenticated users)
router.post('/', authMiddleware, async (req, res) => {
    const { title, startDate, endDate, priority, status } = req.body;
    console.log("Request Body:", req.body);
    console.log("User from request:", req.user); // Log user to check if it's set correctly

    // Ensure all required fields are provided
    if (!title || !startDate || !endDate) {
        return res.status(400).json({ message: "Title, start date, and end date are required." });
    }

    if (!req.user || !req.user._id) { // Check if user ID is available
        return res.status(400).json({ message: "User is not authenticated." });
    }

    const task = new Task({
        title,
        startDate,
        endDate,
        priority: priority || 'defaultPriority', // Set default if not provided
        status: status || 'defaultStatus',       // Set default if not provided
        user: req.user.userId // Ensure you're saving the user's ID
    });

    try {
        const savedTask = await task.save();
        return res.status(201).json(savedTask);
    } catch (err) {
        console.error("Error saving task:", err); // Log the error
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation error', details: err.errors });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
});


// Read all tasks for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Only return tasks for the logged-in user
        const tasks = await Task.find({ user: req.user.userId });
        return res.json(tasks);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Update a task (only for the logged-in user's tasks)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        // Ensure that the task belongs to the logged-in user
        const task = await Task.findOne({ _id: req.params.id, user: req.user.userId });
        if (!task) {
            return res.status(404).json({ message: "Task not found or you're not authorized to update this task" });
        }

        // Update task properties
        task.title = req.body.title || task.title;
        task.startDate = req.body.startDate || task.startDate;
        task.endDate = req.body.endDate || task.endDate;
        task.priority = req.body.priority || task.priority;
        task.status = req.body.status || task.status;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a task (only for the logged-in user's tasks)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        // Ensure the task belongs to the logged-in user
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
        if (!task) {
            return res.status(404).json({ message: "Task not found or you're not authorized to delete this task" });
        }
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
