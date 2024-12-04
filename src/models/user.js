const mongoose= require("mongoose");
const validator = require("validator");

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
        required:true,
        validate(value){
                if(!["male","female","others"].includes(value)){
                    throw new Error("Gender data is not valid");
                }
        },
    },
    photoUrl:{
        type:String,
        default:"https://cdn-icons-png.flaticon.com/512/2202/2202112.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Enter a valid URL");
            }
        }

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

const UserModel= mongoose.model("User",userSchema);
module.exports=UserModel;
