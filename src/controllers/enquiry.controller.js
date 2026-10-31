const Enquiry = require("../models/Enquiry")
const mongoose  = require("mongoose");

const createEnquiry = async (req, res, next) => {
  try {
    const { name, email, courseInterest } = req.body;

    if (!name || !email || !courseInterest) {
      return res.status(400).json({
        status: false,
        message: "Name, email and course interest are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingEnquiry = await Enquiry.findOne({
      email: normalizedEmail,
    });

    if (existingEnquiry) {
      return res.status(409).json({
        status: false,
        message: "An enquiry with this email already exists.",
      });
    }

    const newEnquiry = await Enquiry.create({
      name,
      email: normalizedEmail,
      courseInterest,
    });

    return res.status(201).json({
      status: true,
      message: "Enquiry created successfully.",
      enquiry: newEnquiry,
    });
  } catch (error) {
    next(error);
  }
};

const getAllEnquiries = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find({ claimedBy: null }).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      status: true,
      message: "Enquiries fetched successfully.",
      count: enquiries.length,
      enquiries,
    });
  } catch (error) {
    next(error);
  }
};

const claimEnquiry  = async (req, res, next) =>{
  try{
    const {id}  = req.params

    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({
          success: false,
           message: "Invalid enquiry ID."
        })
    }
    const enquiry  = await Enquiry.findOneAndUpdate(
      {_id:id, claimedBy: null},
      {$set: {claimedBy:req.user._id}},
      {new:true}
    )
  
     if(!enquiry){

      const exists  = await Enquiry.exists({_id:id})
        return res.status(exists ? 409 :404).json({
          success: false,
          message: exists
          ? "This enquiry has already been claimed."
          : "Enquiry not found."
        })
     }
     return res.status(200).json({
      success: true,
       message: "Enquiry claimed successfully.",
       enquiry
     })
  }catch(error){
    next(error);
  }
}

const getMyLeads = async (req, res, next) =>{
  try{
      const enquiries = await Enquiry.find({claimedBy: req.user._id}).sort({createdAt:-1})

      return res.status(200).json({
        success: true,
        message: "Enquiries fetched successfully.",
        count: enquiries.length,
        enquiries
      })
  }catch(error){
    next(error);
  }
}
module.exports = {
  createEnquiry,
  getAllEnquiries,
  claimEnquiry,
  getMyLeads
};
