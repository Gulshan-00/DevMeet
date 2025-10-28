const mongoose= require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema=new mongoose.Schema({
    firstName:{
        type: String,
        required:true,
        minLength:3,
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
        validate(value){
              if(!validator.isEmail(value)){
                throw new Error("Invalid Email address")
              }
        }
    },
    password:{
        type:String,
        required:true,
        minLength:8,
        maxLength:100,
        validate(value){
            if(!validator.isStrongPassword(value)){
               throw new Error("Password is weak");
            }
        }
    },
    gender:{
        type:String,
        validate(value){
                if(!["male","female","others"].includes(value)){
                    throw new Error("Gender data is not valid");
                }
        },
    },
    photoUrl:{
        type:String,
        default:"https://cdn-icons-png.flaticon.com/512/2202/2202112.png",
        // validate(value){
        //     if(!validator.isURL(value)){
        //         throw new Error("Enter a valid URL");
        //     }
        // }

    },
    about:{
        type:String,
        default:"This is the default about section",
        minLength:5,
        maxLength:1000,
    },
    skills:{
        type:[String],
        required:true,
    }
},{
    timestamps:true,
})


//The lines form the 75 to 91 are not used anywhere

userSchema.methods.getJWT=async function(){
    const user=this;
    // const token=jwt.sign({_id:user._id.toString()},"Gulsh@n09",{expiresIn:"1d"});

    const token=await jwt.sign({_id:user._id},"Gulsh@n09",{expiresIn:"1d"});
    return token;
}


userSchema.methods.validatePassword=async function(passwordInputByUser){ 
    const user=this;
    const isPasswordValid=await bcrypt.compare(passwordInputByUser,user.password);
    if(!isPasswordValid){
        throw new Error("Invalid Password");
    }
    return isPasswordValid;
}   


const UserModel= mongoose.model("User",userSchema);
module.exports=UserModel;
