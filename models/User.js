const mongoose = require("mongoose");

// email regex pattern
// const emailRegex =  

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,

        // match:[emailRegex, "please enter the valid email"]
    },
    password: {
        type: String,
        required: [true,"Password is required"],
        minlength: [6, "Password must be at least 6 characters"]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);