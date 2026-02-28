# Notification System Documentation

## Overview
The notification system provides real-time notifications for various user actions including registration, article submissions, likes, and admin approvals.

## Features Implemented

### Notification Types
1. **user_registered** - When a new user registers (sent to admins)
2. **user_approved** - When admin approves a user account
3. **user_rejected** - When admin rejects a user account
4. **article_submitted** - When user submits an article (sent to admins)
5. **article_approved** - When admin approves an article
6. **article_rejected** - When admin rejects an article
7. **article_liked** - When someone likes your article
8. **article_disliked** - When someone dislikes your article
9. **event_created** - When a new event is created
10. **comment_added** - When someone comments on your article

### Backend Components

#### Model: `/models/Notification.js`
- Stores notifications in MongoDB
- Fields: recipient, sender, type, title, message, link, isRead, createdAt

#### Controller: `/controllers/notificationController.js`
Functions:
- `createNotification()` - Create new notification
- `getUserNotifications()` - Get user's notifications
- `getUnreadCount()` - Get count of unread notifications
- `markAsRead()` - Mark single notification as read
- `markAllAsRead()` - Mark all notifications as read
- `deleteNotification()` - Delete a notification

#### Routes: `/routes/notifications.js`
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Frontend Components

#### Script: `/public/js/notifications.js`
Functions:
- `initNotifications()` - Initialize notification system
- `loadNotificationCount()` - Load unread count
- `updateNotificationBadge()` - Update bell icon badge
- `toggleNotifications()` - Show/hide notification panel
- `loadNotifications()` - Load all notifications
- `displayNotifications()` - Display notifications in panel
- `handleNotificationClick()` - Handle notification click
- `markAllNotificationsRead()` - Mark all as read
- `formatNotificationTime()` - Format time display

### Integration Points

#### User Registration
When a user registers:
1. User account created with `isApproved: false`
2. Notification sent to all admins
3. Admin can approve/reject from admin panel
4. User receives notification about approval/rejection

#### Article Submission
When a user submits an article:
1. Article created with `isPublished: false`
2. Notification sent to all admins
3. Admin can approve/reject from admin panel
4. Author receives notification about approval/rejection

#### Article Likes
When someone likes an article:
1. Like count updated
2. Notification sent to article author (if not self-like)
3. Author can click notification to view article

## Usage

### Adding Notification Script to Pages
Add this line before closing `</body>` tag:
```html
<script src="/js/notifications.js"></script>
```

### Creating Custom Notifications
```javascript
const { createNotification } = require('./controllers/notificationController');

// Example: Notify user
await createNotification(
    userId,           // recipient ID
    senderId,         // sender ID (or null for system)
    'custom_type',    // notification type
    'Title',          // notification title
    'Message text',   // notification message
    '/link'           // optional link
);
```

### Checking Notifications in Frontend
The notification bell icon (🔔) automatically appears in the header when user is logged in.
- Badge shows unread count
- Click bell to open notification panel
- Click notification to mark as read and navigate to link
- "Mark all read" button to clear all unread notifications

## Styling
Notifications use existing CSS variables:
- `--primary-color` for titles and accents
- Unread notifications have light blue background (#f0f9ff)
- Read notifications have white background
- Hover effect on notifications

## Auto-refresh
- Notification count refreshes every 30 seconds
- Manual refresh on user actions (like, submit, etc.)

## Database Schema
```javascript
{
  recipient: ObjectId (ref: User),
  sender: ObjectId (ref: User),
  type: String (enum),
  title: String,
  message: String,
  link: String,
  isRead: Boolean (default: false),
  createdAt: Date (default: now)
}
```

## Future Enhancements
- Real-time notifications using WebSockets
- Email notifications
- Push notifications
- Notification preferences/settings
- Notification grouping
- Delete all notifications option
