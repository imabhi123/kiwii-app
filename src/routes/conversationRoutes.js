import express from "express";
import { getAllConversations } from "../controllers/conversationControllers.js";

const router = express.Router();

router.get("/", getAllConversations);

export default router;
