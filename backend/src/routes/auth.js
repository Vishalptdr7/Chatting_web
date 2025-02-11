import { Router } from "express";
import { checkAuth, login, logout, signup, updateProfilePhoto } from "../controllers/auth.js";
import { upload } from "../middleware/multer.js";
import { verifyJWT } from "../middleware/auth.js";
const router = Router();

router.route("/").get((req,res)=>{
    res.send("Hello World");
});
router.route("/signup").post(
  upload.fields([
    {
      name: "profilePic", 
      maxCount: 1,
    },
  ]),
  signup
);

router.route("/login").post(login);

router.route("/logout").post(logout);

router.route("/update-profile").put(verifyJWT, updateProfilePhoto);

router.route("/check").get(verifyJWT,checkAuth);
export default router;