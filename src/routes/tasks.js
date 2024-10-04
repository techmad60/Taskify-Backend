const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middlewares/authMiddleware'); // Import your auth middleware
const { runGeneticAlgorithm } = require('../geneticAlgorithm'); // Adjust the path accordingly

const router = express.Router();



router.get('/schedule', authMiddleware, async (req, res) => {
    try {
        console.log("Fetching tasks for user ID:", req.user.userId);
        const tasks = await Task.find({ user: req.user.userId });

        if (tasks.length === 0) {
            console.log("No tasks found for user ID:", req.user.userId);
            return res.status(404).json({ message: "No tasks found for this user." });
        }

        const bestOrder = runGeneticAlgorithm(tasks);
        console.log("Best task order determined:", bestOrder);
        res.json({ scheduledTasks: bestOrder });
    } catch (error) {
        console.error("Error scheduling tasks:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});



// Create a new task (only for authenticated users)
router.post('/', authMiddleware, async (req, res) => {
    const { title, startDate, endDate, priority, status } = req.body;

    // Log to check received values
    console.log("Request Body:", req.body);

    // Ensure all required fields are provided
    if (!title || !startDate || !endDate) {
        return res.status(400).json({ message: "Title, start date, and end date are required." });
    }

    const task = new Task({
        title,
        startDate, // should already be in ISO format from the frontend
        endDate,
        priority: priority || 'defaultPriority',
        status: status || 'defaultStatus',
        user: req.user.userId
    });

    try {
        const savedTask = await task.save();
        return res.status(201).json(savedTask); // Return the saved task
    } catch (err) {
        console.error("Error saving task:", err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});




// Read all tasks for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.userId });
        return res.status(200).json(tasks); // Ensure you're sending back the entire task object
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
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
