import jwt from "jsonwebtoken";
export const generateToken=(userId,res)=>{
    const token=jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:"7d"});
    
    res.cookie("jwt",token,{
        expires:new Date(Date.now()+7*24*60*60*1000),
        httpOnly:true,
        secure:process.env.NODE_ENV !=="development",
        sameSite:"strict",

    });
    console.log(token);
    return token ;
}