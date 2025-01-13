import { Router } from "express";
import {  changeUserStatus, getAllUsers, loginAdmin, signupAdmin } from "../controllers/adminController.js";

const router = Router();

router.route("/login").post(loginAdmin);
router.route("/signup").post(signupAdmin);
router.route("/change-user-status/:id").post(changeUserStatus);
router.route('/list-all-users').get(getAllUsers)

export default router;
