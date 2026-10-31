const mongoose = require("mongoose");
const enquirySchema  = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      required: [true, "Student email is required"],
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email"]
    },
    courseInterest: {
      type: String,
      required: [true, "Course interest is required"],
      trim: true,
      maxlength: 150
    },
    claimedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        default: null,
        index:true
    }
},{
    timestamps: true
})

module.exports = mongoose.model("Enquiry", enquirySchema);