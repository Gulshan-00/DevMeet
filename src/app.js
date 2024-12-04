const express= require("express");
 const connectDB=require("./config/database");
const app=express();
const User=require("./models/user")
const { signUpValidations } = require("./utils/validation");
const bcrypt=require("bcrypt");

const { AdminAuth }= require("./middleware/auth");

app.use("/admin", AdminAuth);
app.get("/admin/data",(req,res)=>{
    res.send("Data accessed");
})

app.use(express.json());
//signup the used data into the database
app.post("/signup",async(req,res)=>{
    
    try{
        //validdtions
        signUpValidations(req);
        //encrypting the password
        const {firstName, lastName,gender, emailId, password}=req.body;
        const passwordHash=await bcrypt.hash(password,10);

        const userObj={firstName,lastName, gender,emailId,password:passwordHash}
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

app.post("/login", async (req,res)=> {
    try{
        const {emailId, password}=req.body;
        const emailIdFind=await User.findOne({emailId:emailId});
        if(!emailIdFind){
            throw new Error("Invalid Credentals");
        }
        const idPasswordValid=await bcrypt.compare(password,emailIdFind.password)
        if(!idPasswordValid){
            throw new Error("Invalid Credential")
        }else{
            res.send("User Successfully Logged In");
        }

    }catch(error){
           res.status(400).send("ERROR : "+ error.message);
    }
});


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
app.patch("/user/:userid",async (req,res)=>{
    const userid=req.params.userid;
    const userData=req.body;

    try{
        const allowedUpdate=["firstNmae","lastName","gender","photoUrl","about","skills"];
        const isUpdateAllowed=Object.keys(userData).every((k)=> allowedUpdate.includes(k));
        console.log(isUpdateAllowed);

        if(!isUpdateAllowed){
            throw new Error("You are not allowwd to update this field");
        }

        if(userData?.skills.length>10){
            throw new Error("Enter skills upto 10");
        }
        

      await User.findByIdAndUpdate({_id:userid},userData,{
        returnDocument:"after",
        runValidators:true,
      });
      res.send("User is successfully updated");

    }catch(error){
        res.status(400).send("Something went wrong"+ error.message);
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



