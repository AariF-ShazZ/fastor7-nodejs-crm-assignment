const mongoose = require("mongoose");

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI;
    if(!mongoUri){
        throw new Error("MONGO_URI is missing, Add it to .env file");
    }

    try{
        await mongoose.connect(mongoUri)
        console.log("MongoDB connected successfully");
    }catch(err){
        console.error(err.message);
        process.exit(1);
    }
};


module.exports = connectDB;