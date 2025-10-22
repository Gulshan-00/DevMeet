const jwt=require("jsonwebtoken");
const User=require("../models/user");

const userAuth =async (req,res,next)=>{
   try{
    const {token}=req.cookies;
          if(!token){
            throw new Error("Login again-- token expired");
          }
    const decodedToken=await jwt.verify(token, "Gulsh@n09");
     
    const userProfile=await User.findById(decodedToken);
    if(!userProfile){
      throw new Error("User is not found;")
    }
    req.user=userProfile;
    next();
   }catch(error){
      res.status(400).send("ERROR : " + error.message);
   }

}
module.exports={
    userAuth,
};