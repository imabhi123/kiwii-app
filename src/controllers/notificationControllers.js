import Notification from '../models/notificationModel.js';
import {User} from '../models/userModel.js'; // Assuming a User model exists

/**
 * Send a notification to all users.
 */
export const sendNotificationToAllUsers = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    const notification = new Notification({
      title,
      description,
    });

    await notification.save();
    res.status(201).json({ message: 'Notification sent to all users.', notification });
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

    console.log(userId,req.body);

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const notification = new Notification({
      creator: userId,
      title,
      description,
    });

    await notification.save();
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

/**
 * Fetch notifications for a specific user.
 */
export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await Notification.find({
      $or: [{ creator: userId }, { creator: null }],
    }).sort({ createdAt: -1 });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
