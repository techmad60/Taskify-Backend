const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const taskSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 }, // Use _id instead of id
    title: { type: String, required: true },
    checked: { type: Boolean, default: false }, // You might want to include this
    // Add other fields if necessary
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
