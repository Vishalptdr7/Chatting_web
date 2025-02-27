import Group from "../models/group.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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
  groupId: group._id, // ✅ Return groupId
  group,
});
  } catch (error) {
    console.log(error);
    res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
  }
};

export const getGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId)
      .populate("members", "fullname email")
      .populate("admins", "fullname email");

    if (!group) {
      return res.status(404).json({
        statusCode: 404,
        message: "Group not found",
      });
    }

    const isMember = group.members.some(
      (member) => member._id.toString() === req.userId.toString()
    );

    const isAdmin = group.admins.some(
      (admin) => admin._id.toString() === req.userId.toString()
    );

    if (!isMember && !isAdmin) {
      return res.status(403).json({
        statusCode: 403,
        message: "Access Denied: You are not a member of this group",
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Group Fetched Successfully",
      group,
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

export const sendMessage = asyncHandler(async (req, res) => {
  const { groupId, message } = req.body;

  const group = await Group.findById(groupId);
  if (!group) return res.status(404).json({ message: "Group Not Found" });

  group.messages.push({ sender: req.userId, message });
  await group.save();

  res.status(201).json({ statusCode: 201, message: "Message Sent", group });
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
