const mongoose = require ('mongoose');


// Create user schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false, // Default to false, meaning unverified
    },
    passwordResetToken: { 
        type: String, 
        required: false },
    passwordResetExpires: { 
        type: Date, 
        required: false 
    },

});


const User = mongoose.model('User', userSchema);
module.exports = User;
