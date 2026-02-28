// Notification functions
let notificationInterval = null;

// Initialize notifications
function initNotifications() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) {
        loadNotificationCount();
        // Check for new notifications every 30 seconds
        notificationInterval = setInterval(loadNotificationCount, 30000);
    }
}

// Load notification count
async function loadNotificationCount() {
    try {
        const response = await fetch('/api/notifications/unread-count', {
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            updateNotificationBadge(data.count);
        }
    } catch (error) {
        console.error('Error loading notification count:', error);
    }
}

// Update notification badge
function updateNotificationBadge(count) {
    let badge = document.getElementById('notification-badge');
    if (!badge) {
        // Create notification bell button if it doesn't exist
        const authButtons = document.querySelector('.auth-buttons');
        if (authButtons) {
            const bellBtn = document.createElement('button');
            bellBtn.className = 'btn btn-icon';
            bellBtn.id = 'notification-btn';
            bellBtn.onclick = toggleNotifications;
            bellBtn.innerHTML = '🔔';
            bellBtn.style.position = 'relative';
            
            badge = document.createElement('span');
            badge.id = 'notification-badge';
            badge.style.cssText = 'position: absolute; top: -5px; right: -5px; background: #EF4444; color: white; border-radius: 50%; width: 20px; height: 20px; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; font-weight: 600;';
            
            bellBtn.appendChild(badge);
            authButtons.insertBefore(bellBtn, authButtons.firstChild);
        }
    }
    
    if (badge) {
        badge.textContent = count > 99 ? '99+' : count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Toggle notifications panel
async function toggleNotifications() {
    let panel = document.getElementById('notifications-panel');
    
    if (!panel) {
        panel = createNotificationsPanel();
        document.body.appendChild(panel);
        await loadNotifications();
    }
    
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

// Create notifications panel
function createNotificationsPanel() {
    const panel = document.createElement('div');
    panel.id = 'notifications-panel';
    panel.style.cssText = `
        position: fixed;
        top: 70px;
        right: 20px;
        width: 400px;
        max-width: 90vw;
        max-height: 500px;
        background: white;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        z-index: 1000;
        display: none;
        overflow: hidden;
    `;
    
    panel.innerHTML = `
        <div style="padding: 1.5rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; color: var(--primary-color);">Notifications</h3>
            <button onclick="markAllNotificationsRead()" class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">Mark all read</button>
        </div>
        <div id="notifications-list" style="max-height: 400px; overflow-y: auto;">
            <div style="text-align: center; padding: 2rem; color: #999;">Loading...</div>
        </div>
    `;
    
    return panel;
}

// Load notifications
async function loadNotifications() {
    try {
        const response = await fetch('/api/notifications', {
            credentials: 'include'
        });
        
        if (response.ok) {
            const notifications = await response.json();
            displayNotifications(notifications);
        }
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

// Display notifications
function displayNotifications(notifications) {
    const container = document.getElementById('notifications-list');
    
    if (notifications.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 2rem; color: #999;">No notifications</div>';
        return;
    }
    
    container.innerHTML = notifications.map(notif => `
        <div onclick="handleNotificationClick('${notif._id}', '${notif.link || ''}')" 
             style="padding: 1rem; border-bottom: 1px solid #f0f0f0; cursor: pointer; background: ${notif.isRead ? 'white' : '#f0f9ff'}; transition: background 0.3s;"
             onmouseover="this.style.background='#f9f9f9'" 
             onmouseout="this.style.background='${notif.isRead ? 'white' : '#f0f9ff'}'">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                <strong style="color: var(--primary-color); font-size: 0.95rem;">${notif.title}</strong>
                ${!notif.isRead ? '<span style="width: 8px; height: 8px; background: #3B82F6; border-radius: 50%; display: inline-block;"></span>' : ''}
            </div>
            <p style="margin: 0; font-size: 0.9rem; color: #555;">${notif.message}</p>
            <small style="color: #999; font-size: 0.8rem;">${formatNotificationTime(notif.createdAt)}</small>
        </div>
    `).join('');
}

// Handle notification click
async function handleNotificationClick(notificationId, link) {
    try {
        await fetch(`/api/notifications/${notificationId}/read`, {
            method: 'PUT',
            credentials: 'include'
        });
        
        loadNotificationCount();
        
        if (link) {
            window.location.href = link;
        }
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
}

// Mark all notifications as read
async function markAllNotificationsRead() {
    try {
        await fetch('/api/notifications/read-all', {
            method: 'PUT',
            credentials: 'include'
        });
        
        loadNotificationCount();
        await loadNotifications();
    } catch (error) {
        console.error('Error marking all as read:', error);
    }
}

// Format notification time
function formatNotificationTime(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now - time) / 1000); // seconds
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    
    return time.toLocaleDateString();
}

// Close notifications panel when clicking outside
document.addEventListener('click', (e) => {
    const panel = document.getElementById('notifications-panel');
    const btn = document.getElementById('notification-btn');
    
    if (panel && btn && !panel.contains(e.target) && !btn.contains(e.target)) {
        panel.style.display = 'none';
    }
});

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNotifications);
} else {
    initNotifications();
}

// Clean up interval on page unload
window.addEventListener('beforeunload', () => {
    if (notificationInterval) {
        clearInterval(notificationInterval);
    }
});
