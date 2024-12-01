const express= require("express");
 const connectDB=require("./config/database");
const app=express();
const User=require("./models/user")


const { AdminAuth }= require("./middleware/auth");
app.use("/admin", AdminAuth);
app.get("/admin/data",(req,res)=>{
    res.send("Data accessed");
})

app.use(express.json());

app.post("/signup",async(req,res)=>{

    const userObj=(req.body)

    const user=new User(userObj);
    try{
    await user.save();
    res.send("Request send successfully");
    }catch(err){
        res.status(400).send("Error saving the user" + err.message);
    }
})


//All the user in data will be displayed
app.get("/feed",async (req,res)=>{
    const users=await User.find({})
    // console.log(users);
    try {
        res.send(users);
    } catch (error) {
        res.status(401).send("Something went wrong",+error.message);
    }
    
})

//show according to the userID 
app.get("/feed/:userId",async (req,res)=>{
    const id=req.params.userId;
    const idfind=await User.findById(id)
   
    try {
        res.send(idfind);
    } catch (error) {
        res.status(401).send("Something went wrong",+error.message);
    }
})
//to delete the user data
app.delete("/delete",async (req,res)=>{
    const userid=req.body.userId;

    try{
          const userDelete=await User.findByIdAndDelete(userid);
        res.send("Yes user is successfully deleted");
    }catch(error){
      console.log("User is successfully deleted");
    }
    
})
//to update the user information using the patch
app.patch("/user",async (req,res)=>{
    const userid=req.body.userId;
    const userData=req.body;

    try{
      await User.findByIdAndUpdate({_id:userid},userData,{
        returnDocument:"after",
        runValidators:true,
      });
      res.send("User is successfully updated");

    }catch(err){
        res.status(400).send("Something went wrong"+err.message);
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



