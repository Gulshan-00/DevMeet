const express= require("express");
 const connectDB=require("./config/database");
const app=express();
const cors=require("cors");
const User=require("./models/user")
const cookieParser=require("cookie-parser");
const { userAuth }=require("./middleware/auth");
const PORT=4000;

app.use(cors({
    origin:"http://localhost:5173",    //we are white listing the domain name
    credentials:true,
}));
app.use(express.json());  //to conver the json into the javascript object.
app.use(cookieParser()); //to read the cookies 

const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);



   

//feed user by the id
// app.get("/feed/:userId",async (req,res)=>{
// try{
//      const userProfile=req.params;
//     // console.log(userProfile);
//     const findUserById=await User.findById(userProfile.userId);
// if(!findUserById){
//     throw new error("User Not found");
// }
//     //  const userProfile= await User.find({});
//     //  if(!userProfile){
//     //     throw new Error("User not found")
//     //  }
//     res.send(findUserById);

// }catch(error){
//     res.status(400).send("ERROR : " + error.message);
// }
// } )

//all the user will be present in the feed
// app.get("/feed",userAuth,async (req,res)=>{
// try{
//     //  const userProfile=req.user;
//      const userProfile= await User.find({});
//      if(!userProfile){
//         throw new Error("User not found")
//      }
//     res.send(userProfile);

// }catch(error){
//     res.status(400).send("ERROR : " + error.message);
// }
// } )


//to delete the user data
// app.delete("/delete",userAuth,async (req,res)=>{
//     try{
//         const deleteUser=req.user;
//         const userDelete=await User.findByIdAndDelete(deleteUser._id);
//         res.send("Yes user is successfully deleted");
//     }catch(error){
//       console.log("User is successfully deleted");
//     }
    
// })





connectDB().then(()=>{
    console.log("Database is connected successfully");
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    }); 
    }).catch((err)=>{
   console.error("Database is not connected")
   });



