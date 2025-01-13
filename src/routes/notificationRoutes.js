import express from 'express';
import {
  sendNotificationToAllUsers,
  sendNotificationToUser,
  getAllNotifications,
  getUserNotifications,
  deleteNotification,
  toggleNotificationReadStatus,
} from '../controllers/notificationControllers.js';

const router = express.Router();

// Send notification routes
router.post('/send-to-all', sendNotificationToAllUsers);
router.post('/send-to-user/:userId', sendNotificationToUser);
router.delete('/:id', deleteNotification);
router.put('/toggle-read-status/:id', toggleNotificationReadStatus);

// Get notification routes
router.get('/all', getAllNotifications); // Fetch all notifications
router.get('/user/:userId', getUserNotifications); // Fetch notifications for a specific user

export default router;
