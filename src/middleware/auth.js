const AdminAuth =(req,res,next)=>{
    console.log("Admin auth is getting check")
    const token="xyz1";
    const isAdminAuthorized= token=="xyz";
     if(!isAdminAuthorized){
        res.status(401).send("Unauthorized Request");
     }else{
        next();
     }

}
module.exports={
    AdminAuth,
};