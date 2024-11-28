const express= require("express");
 const connectDB=require("./config/database");
const app=express();
const User=require("./models/user")


const { AdminAuth }= require("./middleware/auth");
app.use("/admin", AdminAuth);
app.get("/admin/data",(req,res)=>{
    res.send("Data accessed");
})

app.post("/signup",async(req,res)=>{
    const userObj={
    firstName:"unnati",
    lastName:"chauhan",
    emailId:"unnati12@gmail.com",
    password:"Unn@123",
    gender:"Female",
    }

    const user=new User(userObj);
    try{
    await user.save();
    res.send("Request send successfully");
    }catch(err){
        res.status(400).send("Error saving the user" + err.message);
    }
})


connectDB().then(()=>{
    console.log("Database is connected successfully");
    app.listen(4000,()=>{
        console.log("Server is connected is successfully");
    }); 
}).catch((err)=>{
   console.error("Database is not connected")
});



