const mongoose=require("mongoose");

const connectDB= async()=>{
    await mongoose.connect("mongodb+srv://gulshank:gulshank123@cluster0.omcncqf.mongodb.net/devMeet");
};

module.exports=connectDB;


