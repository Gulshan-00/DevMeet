const express=require("express");
const { signUpValidations } = require("../utils/validation");
const authRouter=express.Router();
const bcrypt=require("bcrypt");
const User=require("../models/user");
const jwt=require("jsonwebtoken")
const {userAuth}=require("../middleware/auth")

//signup the used data into the database
authRouter.post("/signup",async(req,res)=>{
    
    try{
        //validations
        signUpValidations(req);
        //encrypting the password
        const {firstName,emailId, password}=req.body;

        const passwordHash=await bcrypt.hash(password,10);

        const userObj={firstName, emailId,password:passwordHash}
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
        res.send(user);
           
        }else{

             throw new Error("Invalid Credential")
        }

    }catch(error){
           res.status(400).send("ERROR : "+ error.message);
    }
});


//logout the user
authRouter.post("/logout",(req,res)=>{
    
    try{
    const {token}=req.cookies;
    if(!token){
        throw new Error("Please login")
    }
   res.clearCookie("token");

    // res.cookie("token",null,{expiresId:new Date(Date.now())});
      res.send("User is successfully logged out");
}catch(err){
    res.status(400).send("Error: "+err.message);
}

})


authRouter.post("/forgotpassword", userAuth, async (req,res)=>{
    try{
    
        const {emailId,oldPassword,newPassword}=req.body;
        const changePassword=await bcrypt.hash(newPassword,10);

        const user=await User.findOne({emailId:emailId});
        const matchPassword=await bcrypt.compare(oldPassword,user.password);

        if(matchPassword){
            user.password=changePassword;
            user.save();
            res.clearCookie('token');
            res.send("Password changed successfully");
        }else{
            throw new Error("Old Password is incorrect");
        }
        

       res.send("successfully reset password");
    }catch(err){
        res.send("Error: "+err.message);
    }

})

module.exports=authRouter;