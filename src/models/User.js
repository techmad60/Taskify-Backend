const mongoose = require ('mongoose');
const bcrypt = require ('bcrypt');

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
    }
});

// Pre-save middleware to hash password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10); // Hash the password with bcrypt
    }
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
