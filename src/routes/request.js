const express= require("express");
const { userAuth } = require("../middleware/auth");
const connectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");
const requestRouter=express.Router();

requestRouter.post("/request/send/:status/:toUserId",userAuth,async (req,res)=>{
    try{
      
         const fromUserId=req.user._id;
         const toUserId=req.params.toUserId;
         const status= req.params.status;

         const isAllowedStatus=["ignored","interested"]
         if(!isAllowedStatus.includes(status)){
          throw new Error("Invalid Status");
         }

         const toUserData=await UserModel.findById(toUserId);
         if(!toUserData){
            throw new Error("Invalid User Request"+toUserData);
         }

        if (req.user._id.equals(toUserData._id)) {
    throw new Error("Cannot send connection request to yourself!");
  }


         const existingRequests=await connectionRequestModel.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId},
            ],
         });
         if(existingRequests){
            return res.status(400).send("Connection request is laready exist");
         }



         const connectionRequest=new connectionRequestModel({
            fromUserId,
            toUserId,
            status,
         })

         const data=await connectionRequest.save();

         res.json({
            message:req.user.firstName+ " " + status +" " +toUserData.firstName,
            data,
         });

    }catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
});



requestRouter.post("/request/review/:status/:requestId",userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ messaage: "Status not allowed!" });
      }

      const connectionRequest = await connectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ message: "Connection request " + status, data });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports= requestRouter;