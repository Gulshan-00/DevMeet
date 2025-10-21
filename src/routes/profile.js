const express=require("express");
const profileRouter=express.Router();
const {userAuth}=require("../middleware/auth");
const User=require("../models/user");
const {validateProfileEdit}= require("../utils/validation")

 //TO get the profile using the get...
profileRouter.get("/profile/view",userAuth, async (req,res)=>{
try{

    
     const userProfile=req.user;
     if(!userProfile){
        throw new Error("User not found")
     }
    res.send(userProfile);

}catch(error){
    res.status(400).send("ERROR mm: " + error.message);
}
})

//To update the user information using the patch...
profileRouter.patch("/profile/edit",userAuth, async (req,res)=>{
    
    try{

        if(!validateProfileEdit(req)){
            throw new Error("user Update is not allowed");
        }
         
        const loggedInUser=req.user;
        Object.keys(req.body).forEach((key)=>loggedInUser[key]=req.body[key])
             
        await loggedInUser.save();

        // res.send("user updated successfully"); 
        //iska alternative need hai jismae hum json format me data bhenjenge.

        res.json({
            Message:`You data is updated successfully`,
        data:loggedInUser,
        });


    // try{
    //     //this is the user field coming from the auth middleware
    //     const updateUser=req.user;

    //     //user data to update
    //     const userData=req.body;

    //     if(!userData){
    //         throw new Error("Please provide the data to update");
    //     }
  
    //     //only these fields are allowed to update
    //     const allowedUpdate=["firstName","lastName","gender","photoUrl","about","skills"];
      
    //     const isUpdateAllowed=Object.keys(userData).every((k)=> allowedUpdate.includes(k));
    
    //     if(!isUpdateAllowed){
    //         throw new Error("You are not allowd to update this field");
    //     }

    //     if(userData.skills && userData?.skills.length>10){
    //         throw new Error("Enter skills upto 10");
    //     }
        

    //   await User.findByIdAndUpdate({_id:updateUser._id},userData,{
    //     returnDocument:"after",
    //     runValidators:true,
    //   });
    //   res.send("User is successfully updated");

    }catch(error){
        res.status(400).send("ERROR: " + error.message);
    }
})

module.exports=profileRouter;