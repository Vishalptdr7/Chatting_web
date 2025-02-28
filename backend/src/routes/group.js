import express, { Router } from "express";
import {
  createGroup,
  addMembers,
  removeMember,
  sendGroupMessage,
  getMessages,
  deleteGroup,
  getGroup,
} from "../controllers/group.js";
import { verifyJWT } from "../middleware/auth.js";

const groupRouter = Router();

groupRouter.route("/").post(verifyJWT, createGroup);

groupRouter.route("/addMembers").post(verifyJWT, addMembers);

groupRouter.route("/").get(verifyJWT,getGroup);

groupRouter.route("/removeMember").post(verifyJWT, removeMember);

groupRouter.route("/sendMessage/:groupId").post(verifyJWT, sendGroupMessage);

groupRouter.route("/:groupId/messages").get(verifyJWT, getMessages);

groupRouter.route("/:groupId").delete(verifyJWT, deleteGroup);

export default groupRouter;
