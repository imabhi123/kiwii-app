import express from 'express';
import {
  sendNotificationToAllUsers,
  sendNotificationToUser,
  getAllNotifications,
  getUserNotifications,
} from '../controllers/notificationControllers.js';

const router = express.Router();

// Send notification routes
router.post('/send-to-all', sendNotificationToAllUsers);
router.post('/send-to-user/:userId', sendNotificationToUser);

// Get notification routes
router.get('/all', getAllNotifications); // Fetch all notifications
router.get('/user/:userId', getUserNotifications); // Fetch notifications for a specific user

export default router;
