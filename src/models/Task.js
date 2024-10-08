const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const taskSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 }, // Use _id instead of id
    title: { type: String, required: true }, // Required field: Title is essential
    startDate: { type: Date, required: true }, // Optional start date
    endDate: { type: Date, required: true }, // Optional end date (deadline)
    estimatedDuration: { 
        type: Number, 
        default: function() {
            if (this.startDate && this.endDate) {
                return (this.endDate - this.startDate) / (1000 * 60 * 60); // Convert ms to hours
            }
            return 0;
        }
    }, // Automatically calculate duration if dates exist
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium', required: true }, // Optional priority
    //description: { type: String, required: false }, // Optional description
    status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started', required: true }, // Status added
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to User
});

// Export the model to be used in routes
const Task = mongoose.model('Task', taskSchema);
module.exports = Task;