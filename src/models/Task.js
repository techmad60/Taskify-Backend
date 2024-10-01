const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const taskSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 }, // Use _id instead of id
    title: { type: String, required: true }, // Required field: Title is essential
    checked: { type: Boolean, default: false }, // For task completion status
    startDate: { type: Date, required: false }, // Optional start date
    endDate: { type: Date, required: false }, // Optional end date (deadline)
    estimatedDuration: { 
        type: Number, 
        default: function() {
            // Only calculate duration if both startDate and endDate are provided
            if (this.startDate && this.endDate) {
                return (this.endDate - this.startDate) / (1000 * 60 * 60); // Convert ms to hours
            }
            return 0;
        }
    }, // Estimated duration is optional and calculated automatically
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium', required: false }, // Optional priority
    description: { type: String, required: false }, // Optional description field
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
