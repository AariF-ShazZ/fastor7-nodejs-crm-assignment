const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [3, "Name must be at least 3 characters long"],
        maxlength: [10, "Name can not be more than 10 characters long"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase:true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email"]
    },
    password: {
        type: String,
         required: [true, "Password is required"],
         select: false
    }
},{
    timestamps: true
});

module.exports = mongoose.model("Employee", employeeSchema);