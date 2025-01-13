import { Conversation } from "../models/conversationSchema.js";

export const getAllConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .populate("userId", "name email") // Include user details
      .sort({ lastMessageTime: -1 });

    res.status(200).json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
