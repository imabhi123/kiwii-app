import Notification from '../models/notificationSchema.js';
import { User } from '../models/userModel.js'; // Assuming a User model exists

/**
 * Send a notification to all users.
 */
export const sendNotificationToAllUsers = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    const users = await User.find({});
    for (let i = 0; i < users.length; i++) {
      const userId = users[i]._id;
      const notification = new Notification({
        creator: userId,
        title,
        description,
      });

      await notification.save();
    }
    res.status(201).json({ message: 'Notification sent to all users.', title, description });
  } catch (error) {
    console.error('Error sending notification to all users:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

/**
 * Send a notification to a specific user.
 */
export const sendNotificationToUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, description } = req.body;

    console.log(userId, req.body);

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }
    const notification = new Notification({
      creator: userId,
      title,
      description,
    });

    await notification.save();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }


    res.status(201).json({ message: 'Notification sent to the user.', notification });
  } catch (error) {
    console.error('Error sending notification to user:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

/**
 * Fetch all notifications (global view).
 */
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching all notifications:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

export const deleteNotification = async (req, res) => {
  const { id } = req.params; // Extract notification ID from route parameters

  try {
    // Find and delete the notification
    const deletedNotification = await Notification.findByIdAndDelete(id);

    if (!deletedNotification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
      data: deletedNotification,
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the notification',
      error: error.message,
    });
  }
};
/**
 * Fetch notifications for a specific user.
 */
export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await Notification.find({
      creator: userId
    }).sort({ createdAt: -1 });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

export const toggleNotificationReadStatus = async (req, res) => {
  try {
    const { id } = req.params; // Extract notification ID from route parameters
    
    // Find the notification
    const notification = await Notification.findById(id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    // Toggle the isRead status
    notification.isRead = !notification.isRead;
    
    // Save the updated notification
    const updatedNotification = await notification.save();
    
    res.status(200).json({
      success: true,
      message: `Notification marked as ${updatedNotification.isRead ? 'read' : 'unread'}`,
      data: updatedNotification
    });
  } catch (error) {
    console.error('Error toggling notification read status:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the notification',
      error: error.message
    });
  }
};
