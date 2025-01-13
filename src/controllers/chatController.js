// controllers/chatController.js
import { Chat } from '../models/chatSchema.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const chatController = {
  async createChat(req, res) {
    try {
      const { category } = req.body;
      const {userId}=req.params;
      const existingActiveChat = await Chat.findOne({
        user: userId,
        status: { $in: ['pending', 'active'] }
      });
 
      if (existingActiveChat) {
        throw new ApiError(400, 'You already have an active chat session');
      }

      const chat = await Chat.create({
        user: userId,
        category
      });

      // Notify admins about new chat
      req.app.get('socketService').io.to('admin_room').emit('new_chat', {
        chatId: chat._id,
        userId: userId,
        category
      });

      res.status(201).json(
        new ApiResponse(201, chat, 'Chat created successfully')
      );
    } catch (error) {
      throw new ApiError(500, error.message);
    }
  },

  async getChatHistory(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const chats = await Chat.find({
        $or: [
          { user: userId },
          { admin: userId }
        ]
      })
      .sort({ lastMessage: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'email username')
      .populate('admin', 'email');

      const total = await Chat.countDocuments({
        $or: [
          { user: userId },
          { admin: userId }
        ]
      });

      res.status(200).json(
        new ApiResponse(200, {
          chats,
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }, 'Chat history retrieved successfully')
      );
    } catch (error) {
      throw new ApiError(500, error.message);
    }
  },

  async getChatById(req, res) {
    try {
      const chat = await Chat.findById(req.params.chatId)
        .populate('user', 'email username')
        .populate('admin', 'email');

      if (!chat) {
        throw new ApiError(404, 'Chat not found');
      }

      // Verify user has access to this chat
      if (chat.user._id.toString() !== userId.toString() && 
          chat.admin?._id.toString() !== userId.toString()) {
        throw new ApiError(403, 'You do not have access to this chat');
      }

      res.status(200).json(
        new ApiResponse(200, chat, 'Chat retrieved successfully')
      );
    } catch (error) {
      throw new ApiError(500, error.message);
    }
  },

  async resolveChat(req, res) {
    try {
      const chat = await Chat.findById(req.params.chatId);

      if (!chat) {
        throw new ApiError(404, 'Chat not found');
      }

      if (req.user.role !== 'admin') {
        throw new ApiError(403, 'Only admins can resolve chats');
      }

      chat.status = 'resolved';
      await chat.save();

      req.app.get('socketService').io.to(chat._id.toString()).emit('chat_resolved', {
        chatId: chat._id,
        adminId: userId
      });

      res.status(200).json(
        new ApiResponse(200, chat, 'Chat resolved successfully')
      );
    } catch (error) {
      throw new ApiError(500, error.message);
    }
  }
};