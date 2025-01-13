// services/socketService.js
import { Server } from 'socket.io';
import { Chat } from '../models/chatSchema.js';
import { verifyAccessToken } from '../utils/jwt.js'; // Changed from verifyToken to verifyAccessToken

export class SocketService {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });
    
    this.userSockets = new Map();
    this.adminSockets = new Map();
    
    this.setupSocketHandlers();
  }

  setupSocketHandlers() {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        const decoded = verifyAccessToken(token); // Changed from verifyToken to verifyAccessToken
        socket.user = decoded;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });

    this.io.on('connection', (socket) => {
      console.log(`Socket connected: ${socket.id}`);
      
      if (socket.user.role === 'admin') {
        this.adminSockets.set(socket.user._id.toString(), socket);
      } else {
        this.userSockets.set(socket.user._id.toString(), socket);
      }

      socket.on('join_chat', (chatId) => this.handleJoinChat(socket, chatId));
      socket.on('send_message', (data) => this.handleMessage(socket, data));
      socket.on('admin_typing', (chatId) => this.handleTyping(socket, chatId, 'admin'));
      socket.on('user_typing', (chatId) => this.handleTyping(socket, chatId, 'user'));
      socket.on('disconnect', () => this.handleDisconnect(socket));
    });
  }

  async handleJoinChat(socket, chatId) {
    socket.join(chatId);
    
    if (socket.user.role === 'admin') {
      await Chat.findByIdAndUpdate(chatId, {
        admin: socket.user._id,
        status: 'active'
      });
      
      this.io.to(chatId).emit('admin_joined', {
        adminId: socket.user._id,
        message: 'Admin has joined the chat'
      });
    }
  }

  async handleMessage(socket, { chatId, content }) {
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) throw new Error('Chat not found');

      const message = {
        sender: socket.user._id,
        senderModel: socket.user.role === 'admin' ? 'Admin' : 'User',
        content,
        timestamp: new Date()
      };

      chat.messages.push(message);
      chat.lastMessage = new Date();
      await chat.save();

      this.io.to(chatId).emit('new_message', {
        chatId,
        message
      });

      // Send notification to the other party
      if (socket.user.role === 'admin') {
        const userSocket = this.userSockets.get(chat.user.toString());
        if (userSocket) {
          userSocket.emit('notification', {
            type: 'new_message',
            chatId,
            message: 'New message from support'
          });
        }
      } else {
        const adminSocket = this.adminSockets.get(chat.admin?.toString());
        if (adminSocket) {
          adminSocket.emit('notification', {
            type: 'new_message',
            chatId,
            message: 'New message from user'
          });
        }
      }
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  }

  handleTyping(socket, chatId, role) {
    socket.to(chatId).emit(`${role}_typing`, {
      chatId,
      userId: socket.user._id
    });
  }

  handleDisconnect(socket) {
    if (socket.user.role === 'admin') {
      this.adminSockets.delete(socket.user._id.toString());
    } else {
      this.userSockets.delete(socket.user._id.toString());
    }
    console.log(`Socket disconnected: ${socket.id}`);
  }
}