import { Router } from "express";
import { changeCurrentPassword, changeUserStatus, getCurrentUser, getUserProfile, googleLoginUser, googleRegisterUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserprofilePicture } from "../controllers/user-controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/register").post(
  registerUser
);
router.route("/google-register").post(
  googleRegisterUser
);

router.route("/login").post(loginUser);
router.put("/status/:userId", changeUserStatus);

//secured routes
router.route('/logout').post(verifyJWT,logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT,changeCurrentPassword);
router.route("/get-user-profile").post(getUserProfile);
router.route("/current-user").get(verifyJWT,getCurrentUser);
router.route("/update-details").patch(verifyJWT,updateAccountDetails);


router.route("/profilePicture").patch(verifyJWT,upload.single("profilePicture"),updateUserprofilePicture);


export default router;
