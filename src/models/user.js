const mongoose= require("mongoose");

const userSchema=new mongoose.Schema({
    firstName:{
        type: String,
        required:true,
        minLength:5,
    },
    lastName:{
        type: String,
        
    },
    emailId:{
        type:String,
        required:true,
        trim: true,
        unique: true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
        minLength:8,
        maxLength:20,
    },
    gender:{
        type:String,
        required:true,
        validate(value){
                if(!["male","female","others"].includes(value)){
                    throw new Error("Gender data is not valid");
                }
        },
    },
    photoUrl:{
        type:String,
        default:"https//grographyandyou.com/images/user-profile.png",
    },
    about:{
        type:String,
        default:"This is the default about section",
    },
    skills:{
        type:[String],
        required:true,
    }
},{
    timestamps:true,
})

const UserModel= mongoose.model("User",userSchema);
module.exports=UserModel;
