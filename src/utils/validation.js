const validator = require("validator");

const signUpValidations =(req)=>{
const {firstName,emailId,password}=req.body;
if(!firstName){
    throw new Error("first name or last name is not valid");
}
else if(!validator.isEmail(emailId)){
    throw new Error("Email is not valid");
}else if(!validator.isStrongPassword(password)){
    throw new Error("Password is weak");
}
}



const validateProfileEdit=(req)=>{

    const ALLOWED_UPDATE=["photoUrl","age","gender","skills","about"];
    const isUpdateAllowed= Object.keys(req.body).every(key=>ALLOWED_UPDATE.includes(key));
    return isUpdateAllowed;

}



module.exports={signUpValidations,validateProfileEdit};