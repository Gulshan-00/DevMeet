const express=require("express");
const { signUpValidations } = require("../utils/validation");
const authRouter=express.Router();
const bcrypt=require("bcrypt");
const User=require("../models/user");
const jwt=require("jsonwebtoken")

//signup the used data into the database
authRouter.post("/signup",async(req,res)=>{
    
    try{
        //validations
        signUpValidations(req);
        //encrypting the password
        const {firstName, lastName, emailId, password,gender,profileUrl,about,skills}=req.body;
        const passwordHash=await bcrypt.hash(password,10);

        const userObj={firstName,lastName, gender,emailId,password:passwordHash,profileUrl,about,skills}
        const user=new User(userObj);

            // if(req?.body?.skills.length>10){
            //     throw new Error("Enter skills upto 10");
            // }
        await user.save();
    res.send("Request send successfully");
    }catch(error){
        res.status(400).send("Error in saving the user"+" " +error.message);
    }
})


//login the user
authRouter.post("/login", async (req,res)=> {
    try{
        const {emailId, password}=req.body;
        const user=await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Invalid Credentals");
        }

         const isPasswordValid=await bcrypt.compare(password, user.password)
                     //bcrypting the password ------- userSchema me jao
        //   const idPasswordValid=await user.validatePassword(password);
          
        if(isPasswordValid){    

            //token generation   ---------usersSchema me jao
        //   const token=await user.getJWT();


        //JWT STARTS
        const token= await jwt.sign({_id:user._id},"Gulsh@n09"); 
        res.cookie("token",token);
        res.send("login Successful");
           
        }else{
             throw new Error("Invalid Credential")
        }

    }catch(error){
           res.status(400).send("ERROR : "+ error.message);
    }
});


//logout the user
authRouter.post("/logout",(req,res)=>{
         
   res.clearCookie("token");

    // res.cookie("token",null,{expiresId:new Date(Date.now())});
      res.send("User is successfully logged out");

})

module.exports=authRouter;