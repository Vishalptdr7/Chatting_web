import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.js";
import Message from "../models/messages.js";
import { io } from "../lib/socket.js";
import cloudinary from "cloudinary"
import { ApiError } from "../utils/ApiErrors.js";
import { uploadfileOnCloudinary } from "../utils/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getUsersForSidebar=asyncHandler(async(req,res)=>{
    try {
        const loggedInUserId=req.user._id;
        const filterUser=await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        res.status(200).json(filterUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Internal Server Error"});
        
    }
});



export const getMessages=asyncHandler(async(req,res)=>{
    //get the current user from the request
    //get the recipient user id from the request query
    //find all the messages between the two users
    //send a response with the messages
    try {
        const {id:userChatId}=req.params;
        const myId=req.user._id;


        
        const messages = await Message.find({
          $or: [
            { senderId: myId, receiverId: userChatId },
            {
              senderId: userChatId,
              receiverId: myId,
            },
          ],
        });
        res.status(200).json(messages

        )
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Internal Server Error"});
        
    }

})