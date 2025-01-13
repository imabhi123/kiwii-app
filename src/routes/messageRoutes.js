import express from "express";
import {
  sendMessage,
  getMessagesByConversation,
  respondToMessage,
  getMessagesByUser,
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/send", sendMessage);
router.get("/:conversationId", getMessagesByConversation);
router.post("/respond", respondToMessage);
router.get("/user/:userId", getMessagesByUser);

export default router;
