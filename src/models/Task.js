const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const taskSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4 },
    title: { type: String, required: true },
    // Add other fields if necessary
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
