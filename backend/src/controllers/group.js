import Group from "../models/group.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { io } from "../lib/socket.js";
import cloudinary from "cloudinary";

export const createGroup = async (req, res) => {
  try {
    const { groupName, members } = req.body;
    if (!groupName) {
      return res.status(400).json({
        statusCode: 400,
        message: "Group name is required",
      });
    }
    if (members.length < 2) {
      return res.status(400).json({
        statusCode: 400,
        message: "At least 2 members are required",
      });
    }

    const group = await Group.create({
      groupName,
      members,
      admins: [req.user._id],
    });

    res.status(201).json({
      statusCode: 201,
      message: "Group Created",
      groupId: group._id,
      group,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
  }
};

export const getGroup = async (req, res) => {
  try {
    const userGroups = await Group.find({
      $or: [{ members: req.user._id }, { admins: req.user._id }],
    })
      .populate("members", "fullname email")
      .populate("admins", "fullname email");

    if (userGroups.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: "No Groups Found",
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Groups Fetched Successfully",
      groups: userGroups,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
};

export const addMembers = asyncHandler(async (req, res) => {
  const { groupId, newMembers } = req.body;

  const group = await Group.findById(groupId);
  if (!group) return res.status(404).json({ message: "Group Not Found" });

  group.members.push(...newMembers);
  await group.save();

  res.json({ statusCode: 200, message: "Members Added", group });
});

export const removeMember = asyncHandler(async (req, res) => {
  const { groupId, memberId } = req.body;

  const group = await Group.findById(groupId);
  if (!group) return res.status(404).json({ message: "Group Not Found" });

  group.members = group.members.filter((id) => id.toString() !== memberId);
  await group.save();

  res.json({ statusCode: 200, message: "Member Removed", group });
});

export const sendGroupMessage = asyncHandler(async (req, res) => {
  try {
    const { text, image } = req.body;
    console.log(text);
    const { groupId } = req.params;
    const senderId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group Not Found" });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = {
      sender: senderId,
      message: text,
      image: imageUrl,
      createdAt: new Date(),
    };

    group.messages.push(newMessage);
    await group.save();

    io.to(groupId).emit("receiveGroupMessage", {
      groupId,
      sender: senderId,
      message: text,
      image: imageUrl,
      createdAt: newMessage.createdAt,
    });

    res.status(201).json({
      statusCode: 201,
      message: "Message Sent",
      group,
    });
  } catch (error) {
    console.error("Error in sendGroupMessage controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export const getMessages = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const group = await Group.findById(groupId).populate("messages.sender");
  if (!group) return res.status(404).json({ message: "Group Not Found" });

 res.json({ statusCode: 200, messages: group.messages });
});

export const deleteGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const group = await Group.findByIdAndDelete(groupId);
  if (!group) return res.status(404).json({ message: "Group Not Found" });

  res.json({ statusCode: 200, message: "Group Deleted Successfully" });
});
