// controllers/messageController.js
import { Message } from "../models/messageSchema.js";
import { Conversation } from "../models/conversationSchema.js";
import { notifyAdmins } from "../services/notificationService.js";

export const sendMessage = async (req, res) => {
  try {
    const { senderId, message } = req.body;

    let conversation = await Conversation.findOne({ userId: senderId });

    if (!conversation) {
      conversation = new Conversation({
        userId: senderId,
        lastMessage: message,
        lastMessageTime: Date.now(),
      });
      await conversation.save();
    } else {
      conversation.lastMessage = message;
      conversation.lastMessageTime = Date.now();
      await conversation.save();
    }

    const newMessage = new Message({
      senderId,
      senderType: "User",
      message,
      conversationId: conversation._id,
    });

    await newMessage.save();

    notifyAdmins({
      type: 'user_message',
      message,
      senderId,
      conversationId: conversation._id
    });

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getMessagesByConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const respondToMessage = async (req, res) => {
  try {
    const { senderId="676144712b7384611017743d", conversationId, message } = req.body;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    const newMessage = new Message({
      senderId,
      senderType: "Admin",
      message,
      conversationId,
    });

    conversation.lastMessage = message;
    conversation.lastMessageTime = Date.now();

    await Promise.all([newMessage.save(), conversation.save()]);

    notifyAdmins({
      type: 'admin_response',
      message,
      conversationId,
      senderId: conversation.userId
    });

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getMessagesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the conversation using userId
    const conversation = await Conversation.findOne({ userId });
    if (!conversation) {
      return res
        .status(404)
        .json({ success: false, message: "No conversation found for this user" });
    }

    // Fetch all messages for the found conversation
    const messages = await Message.find({ conversationId: conversation._id }).sort({
      createdAt: 1,
    });

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
