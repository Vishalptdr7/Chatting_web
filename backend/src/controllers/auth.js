import e from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.js";
import { uploadfileOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiRespone.js";
import { generateToken } from "../lib/util.js";
import mongoose from "mongoose";
import cloudinary from "cloudinary"
export const signup = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    if (!fullname) throw new ApiError(400, "Full Name is required");
    if (!email) throw new ApiError(400, "Email is required");
    if (!password) throw new ApiError(400, "Password is required");
    if (password.length < 6)
      throw new ApiError(400, "Password must be at least 6 characters long");

    const userExists = await User.findOne({ email });
    if (userExists) throw new ApiError(400, "Email already exists");

  
    const newUser = await User.create({
      email,
      password,
      fullname,
    });
    if (newUser){
        generateToken(newUser._id,res)
        await newUser.save();
        return res
          .status(201)
          .json(
            new ApiResponse(201, { newUser }, "User Created Successfully")
          );
    }

   
    
  } catch (error) {
    console.error("Signup Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});



export const login=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    if (!email ){
        return res.status(400).json(new ApiError({message:"Email is required"}));

    }
    if (!password){
        return res.status(400).json(new ApiError({message:"Password is required"}));
    }

    const user=await User.findOne({email}).select('+password');
    if (!user){
        return res.status(401).json(new ApiError({message:"Invalid credentials"}));
    }
    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch){
        return res.status(401).json(new ApiError({message:"Invalid credentials"}));
    }
    generateToken(user._id,res)
    return res.status(200).json(new ApiResponse(200,{ user },{message:"Logged in successfully"},"Logged in Successfully"));
 
});

export const logout=asyncHandler((req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0});
       return  res.status(200).json(new ApiResponse({message:"Logout Successfully"}))
        
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json(new ApiResponse({message:"Internal Server Error"}));
        
    }
});

// export const updateProfilePhoto = asyncHandler(async (req, res) => {
//   // Use req.user._id instead of req.params.id (if middleware is used)
//   const userId = req.user ? req.user._id : req.params.id;
//   console.log(userId);
//   // Validate userId
//   if (!mongoose.Types.ObjectId.isValid(userId)) {
//     return res.status(400).json(new ApiError(400, "Invalid user ID"));
//   }

//   try {
//     // Check if user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json(new ApiError(404, "User not found"));
//     }

//     // Update user profile photo
//     user.profilePic = req.body.profilePic;
//     await user.save();

//     return res
//       .status(200)
//       .json(new ApiResponse(200, user, "Profile photo updated successfully"));
//   } catch (error) {
//     console.error("Update Profile Photo Error:", error);
//     return res.status(500).json(new ApiError(500, "Internal Server Error"));
//   }
// });

export const updateProfilePhoto = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.url },
      { new: true }
    );
    console.log(profilePic)
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth=asyncHandler(async(req,res)=>{
        try {
            res.status(200).json(new ApiResponse(req.user))
        } catch (error) {
            console.error("Check Auth Error:", error);
            return res.status(500).json(new ApiResponse(500, "Internal Server Error"));
    


        }
})