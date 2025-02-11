import { Router } from "express";

import { upload } from "../middleware/multer.js";

import { verifyJWT } from "../middleware/auth.js";
import { getUsersForSidebar,getMessages, sendMessage } from "../controllers/message.js";

const messageRouter=Router();


messageRouter.route("/send/:id").post(verifyJWT,upload.fields([
    {
      name: "image", 
      maxCount: 10,
    },
  ]),sendMessage);


messageRouter.route("/users").get(verifyJWT,getUsersForSidebar);

messageRouter.route("/:id").get(verifyJWT,getMessages)
export default messageRouter;