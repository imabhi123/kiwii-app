import { Router } from "express";
import {  loginAdmin, signupAdmin } from "../controllers/adminController.js";

const router = Router();

router.route("/login").post(loginAdmin);
router.route("/signup").post(signupAdmin);

export default router;
