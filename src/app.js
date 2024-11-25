const express= require("express");

const app=express();

app.use("/hello",(req,res)=>{
    res.send("hello this is gulshan");
})

app.use("/test",(req,res)=>{
    res.send("this is test request");
})

app.use("/",(req,res)=>{
    res.send("This is home page");
})

app.listen(4000);