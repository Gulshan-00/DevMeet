const express=require("express");
const profileRouter=express.Router();
const {userAuth}=require("../middleware/auth");
const User=require("../models/user");

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
profileRouter.patch("/profile/edit",userAuth,async (req,res)=>{
    

    try{
        //this is the user field coming from the auth middleware
        const updateUser=req.user;

        //user data to update
        const userData=req.body;

        if(!userData){
            throw new Error("Please provide the data to update");
        }
  
        //only these fields are allowed to update
        const allowedUpdate=["firstName","lastName","gender","photoUrl","about","skills"];
      
        const isUpdateAllowed=Object.keys(userData).every((k)=> allowedUpdate.includes(k));
    
        if(!isUpdateAllowed){
            throw new Error("You are not allowd to update this field");
        }

        if(userData?.skills.length>10){
            throw new Error("Enter skills upto 10");
        }
        

      await User.findByIdAndUpdate({_id:updateUser._id},userData,{
        returnDocument:"after",
        runValidators:true,
      });
      res.send("User is successfully updated");

    }catch(error){
        res.status(400).send("Something went wrong: " + error.message);
    }
})

module.exports=profileRouter;