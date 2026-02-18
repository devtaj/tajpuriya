// Check if user is logged in and update navigation
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    const dropdownMenu = document.getElementById('dropdown-menu');
    
    if (user && dropdownMenu) {
        // User is logged in - update dropdown content
        dropdownMenu.innerHTML = `
            <div style="padding: 0.8rem 1.2rem; border-bottom: 1px solid var(--border-color); font-weight: 600; color: var(--primary-color); white-space: nowrap;">
                ${user.name}
            </div>
            <a href="/profile" style="display: block; padding: 0.8rem 1.2rem; color: var(--text-dark); text-decoration: none; transition: all 0.2s ease; font-weight: 500;">Profile</a>
            <a href="#" onclick="handleLogout(event); return false;" style="display: block; padding: 0.8rem 1.2rem; color: var(--text-dark); text-decoration: none; transition: all 0.2s ease; font-weight: 500;">Logout</a>
        `;
    }
});

// Handle logout
function handleLogout(event) {
    event.preventDefault();
    
    fetch('/api/auth/logout', {
        method: 'POST'
    })
    .then(() => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    })
    .catch(error => {
        console.error('Logout error:', error);
        localStorage.removeItem('user');
        window.location.href = '/login';
    });
}