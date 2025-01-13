// services/notificationService.js
import { Server } from "socket.io";

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map();
  }

  initialize(server, corsOptions = {}) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        ...corsOptions
      },
    });

    this.setupEventHandlers();
    return this.io;
  }

  setupEventHandlers() {
    this.io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("join_conversation", (conversationId) => {
        socket.join(`conversation:${conversationId}`);
        console.log(`Socket ${socket.id} joined conversation: ${conversationId}`);
      });

      socket.on("leave_conversation", (conversationId) => {
        socket.leave(`conversation:${conversationId}`);
        console.log(`Socket ${socket.id} left conversation: ${conversationId}`);
      });

      socket.on("disconnect", () => {
        if (socket.userId) {
          this.connectedUsers.delete(socket.userId);
        }
        console.log("Client disconnected:", socket.id);
      });
    });
  }

  notifyAdmins(data) {
    if (!this.io) return;

    if (data.type === 'admin_response') {
      // Emit to specific conversation room and all admins
      this.io.to(`conversation:${data.conversationId}`).emit("admin_response", data);
      this.io.emit("conversation_update", {
        conversationId: data.conversationId,
        lastMessage: data.message,
        lastMessageTime: new Date().toISOString()
      });
    } else {
      // Broadcast new user messages to all admins
      this.io.emit("new_message", data);
      this.io.emit("conversation_update", {
        conversationId: data.conversationId,
        lastMessage: data.message,
        lastMessageTime: new Date().toISOString()
      });
    }
  }
}

// Create and export singleton instance
const socketService = new SocketService();

// Export both the service instance and the notifyAdmins function
export const notifyAdmins = (data) => socketService.notifyAdmins(data);
export default socketService;