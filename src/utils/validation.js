const validator = require("validator");

const signUpValidations =(req)=>{
const {firstName,lastName,emailId,password}=req.body;
if(!firstName || !lastName){
    throw new Error("first name or last name is not valid");
}
else if(!validator.isEmail(emailId)){
    throw new Error("Email is not valid");
}else if(!validator.isStrongPassword(password)){
    throw new Error("Password is weak");
}
}

module.exports={signUpValidations};