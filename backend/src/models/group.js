import mongoose from "mongoose";
const { Schema } = mongoose;

const GroupChatSchema = new Schema(
  {
    groupName: {
      type: String,
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        message: {
          type: String,
        },
        readBy: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    groupIcon: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);


const Group = mongoose.model("Group", GroupChatSchema);
export default Group;
