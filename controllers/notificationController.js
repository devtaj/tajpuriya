const Notification = require('../models/Notification');

// Create notification helper function
const createNotification = async (recipientId, senderId, type, title, message, link = null) => {
    try {
        const notification = new Notification({
            recipient: recipientId,
            sender: senderId,
            type,
            title,
            message,
            link
        });
        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        return null;
    }
};

// Get user notifications
const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .populate('sender', 'name profileImage')
            .sort({ createdAt: -1 })
            .limit(50);
        
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications' });
    }
};

// Get unread count
const getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({ 
            recipient: req.user.id, 
            isRead: false 
        });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching unread count' });
    }
};

// Mark as read
const markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error marking notification as read' });
    }
};

// Mark all as read
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user.id, isRead: false },
            { isRead: true }
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error marking all as read' });
    }
};

// Delete notification
const deleteNotification = async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting notification' });
    }
};

module.exports = {
    createNotification,
    getUserNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
};
