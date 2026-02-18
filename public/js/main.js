// Cultural Community Website - Main JavaScript

class CommunityApp {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  init() {
    this.checkAuthStatus();
    this.bindEvents();
    this.loadPageContent();
  }

  // Authentication
  async checkAuthStatus() {
    try {
      const response = await fetch('/api/auth/profile');
      if (response.ok) {
        this.currentUser = await response.json();
        this.updateAuthUI();
      }
    } catch (error) {
      console.log('Not authenticated');
    }
  }

  updateAuthUI() {
    // Auth UI is now handled by auth-nav.js
  }

  async login(email, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (response.ok) {
        this.currentUser = data.user;
        this.showAlert('Login successful!', 'success');
        setTimeout(() => window.location.href = '/', 1000);
      } else {
        this.showAlert(data.message, 'error');
      }
    } catch (error) {
      this.showAlert('Login failed. Please try again.', 'error');
    }
  }

  async register(formData) {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (response.ok) {
        this.showAlert('Registration successful! Awaiting admin approval.', 'success');
        setTimeout(() => window.location.href = '/login', 2000);
      } else {
        this.showAlert(data.message || 'Registration failed', 'error');
      }
    } catch (error) {
      this.showAlert('Registration failed. Please try again.', 'error');
    }
  }

  async logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      this.currentUser = null;
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Members
  async loadMembers(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`/api/members?${params}`);
      const members = await response.json();
      
      this.displayMembers(members);
    } catch (error) {
      console.error('Error loading members:', error);
    }
  }

  displayMembers(members) {
    const container = document.getElementById('members-container');
    if (!container) return;

    container.innerHTML = members.map(member => `
      <div class="member-card">
        <img src="${member.profileImage || '/images/default-avatar.png'}" 
             alt="${member.name}" class="member-avatar">
        <h3 class="member-name">${member.name}</h3>
        <p class="member-profession">${member.profession}</p>
        <p class="member-location">${member.address?.city || ''}</p>
      </div>
    `).join('');
  }

  // Events
  async loadEvents(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`/api/events?${params}`);
      const events = await response.json();
      
      this.displayEvents(events);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  }

  displayEvents(events) {
    const container = document.getElementById('events-container');
    if (!container) return;

    container.innerHTML = events.map(event => {
      const eventDate = new Date(event.date);
      const day = eventDate.getDate();
      const month = eventDate.toLocaleDateString('en', { month: 'short' });
      
      return `
        <div class="event-card">
          <div class="event-date">
            <div class="event-day">${day}</div>
            <div class="event-month">${month}</div>
          </div>
          <div class="event-details">
            <h3 class="event-title">${event.title}</h3>
            <p class="event-info"><strong>Time:</strong> ${event.time}</p>
            <p class="event-info"><strong>Location:</strong> ${event.location}</p>
            <p class="event-description">${event.description}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  // Posts
  async loadPosts(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`/api/posts?${params}`);
      const posts = await response.json();
      
      this.displayPosts(posts);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  }

  displayPosts(posts) {
    const container = document.getElementById('posts-container');
    if (!container) return;

    container.innerHTML = posts.map(post => `
      <div class="card">
        ${post.image ? `<img src="${post.image}" alt="${post.title}" class="card-image">` : ''}
        <div class="card-content">
          <h3 class="card-title">${post.title}</h3>
          <p class="card-text">${post.excerpt}</p>
          <small>By ${post.author.name} • ${new Date(post.createdAt).toLocaleDateString()}</small>
        </div>
      </div>
    `).join('');
  }

  // Contact Form
  async submitContact(formData) {
    try {
      const response = await fetch('/api/posts/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        this.showAlert('Message sent successfully!', 'success');
        document.getElementById('contact-form').reset();
      } else {
        this.showAlert(data.message, 'error');
      }
    } catch (error) {
      this.showAlert('Failed to send message. Please try again.', 'error');
    }
  }

  // Admin Functions
  async loadPendingMembers() {
    console.log('loadPendingMembers called');
    try {
      console.log('Fetching users from /api/auth/test-users');
      const response = await fetch('/api/auth/test-users');
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      const allUsers = data.users || [];
      
      console.log('All users:', allUsers.length);
      
      // Filter only pending members (not approved)
      const pendingMembers = allUsers.filter(user => user.isApproved === false);
      
      console.log('Pending members:', pendingMembers.length, pendingMembers);
      
      this.displayPendingMembers(pendingMembers);
    } catch (error) {
      console.error('Error loading pending members:', error);
      const container = document.getElementById('pending-members');
      if (container) {
        container.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--error-color);">Error loading pending members: ' + error.message + '</p>';
      }
    }
  }

  displayPendingMembers(members) {
    const container = document.getElementById('pending-members');
    if (!container) return;

    if (members.length === 0) {
      container.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-light);">No pending member approvals at this time.</p>';
      return;
    }

    container.innerHTML = `
      <table style="width: 100%; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <thead>
          <tr style="background: var(--primary-color); color: white;">
            <th style="padding: 1rem; text-align: left;">Photo</th>
            <th style="padding: 1rem; text-align: left;">Name</th>
            <th style="padding: 1rem; text-align: left;">Email</th>
            <th style="padding: 1rem; text-align: left;">Profession</th>
            <th style="padding: 1rem; text-align: left;">Phone</th>
            <th style="padding: 1rem; text-align: center;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${members.map(member => `
            <tr style="border-bottom: 1px solid var(--border-color);">
              <td style="padding: 1rem;">
                <img src="${member.profileImage || '/images/default-avatar.png'}" 
                     alt="${member.name}" 
                     style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;">
              </td>
              <td style="padding: 1rem; font-weight: 600;">${member.name}</td>
              <td style="padding: 1rem;">${member.email}</td>
              <td style="padding: 1rem;">${member.profession}</td>
              <td style="padding: 1rem;">${member.phone || 'N/A'}</td>
              <td style="padding: 1rem; text-align: center;">
                <button class="btn btn-primary" onclick="app.approveMember('${member._id}')" style="margin-right: 0.5rem; padding: 0.5rem 1rem;">Approve</button>
                <button class="btn btn-secondary" onclick="app.rejectMember('${member._id}')" style="padding: 0.5rem 1rem;">Reject</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  async approveMember(memberId) {
    try {
      const response = await fetch(`/api/auth/approve/${memberId}`, {
        method: 'PUT'
      });

      if (response.ok) {
        this.showAlert('Member approved successfully!', 'success');
        this.loadPendingMembers();
        // Refresh stats if on admin page
        if (typeof loadAdminStats === 'function') {
          loadAdminStats();
        }
      }
    } catch (error) {
      this.showAlert('Failed to approve member', 'error');
    }
  }

  async rejectMember(memberId) {
    if (!confirm('Are you sure you want to reject this member?')) return;

    try {
      const response = await fetch(`/api/auth/reject/${memberId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        this.showAlert('Member rejected successfully!', 'success');
        this.loadPendingMembers();
        // Refresh stats if on admin page
        if (typeof loadAdminStats === 'function') {
          loadAdminStats();
        }
      }
    } catch (error) {
      this.showAlert('Failed to reject member', 'error');
    }
  }

  // Utility Functions
  showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => alertDiv.remove(), 5000);
  }

  showSpinner(container) {
    container.innerHTML = '<div class="spinner"></div>';
  }

  bindEvents() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        this.login(email, password);
      });
    }

    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(registerForm);
        this.register(formData);
      });
    }

    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          subject: document.getElementById('subject').value,
          message: document.getElementById('message').value,
          type: document.getElementById('type')?.value || 'contact'
        };
        this.submitContact(formData);
      });
    }

    // Search and filter
    const searchInput = document.getElementById('search');
    if (searchInput) {
      searchInput.addEventListener('input', this.debounce(() => {
        this.handleSearch();
      }, 300));
    }

    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
      select.addEventListener('change', () => this.handleSearch());
    });
  }

  handleSearch() {
    const search = document.getElementById('search')?.value || '';
    const profession = document.getElementById('profession-filter')?.value || '';
    const city = document.getElementById('city-filter')?.value || '';
    const category = document.getElementById('category-filter')?.value || '';
    const type = document.getElementById('type-filter')?.value || '';

    const filters = {};
    if (search) filters.search = search;
    if (profession) filters.profession = profession;
    if (city) filters.city = city;
    if (category) filters.category = category;
    if (type) filters.type = type;

    // Load appropriate content based on current page
    if (document.getElementById('members-container')) {
      this.loadMembers(filters);
    } else if (document.getElementById('events-container')) {
      this.loadEvents(filters);
    } else if (document.getElementById('posts-container')) {
      this.loadPosts(filters);
    }
  }

  loadPageContent() {
    // Load content based on current page
    if (document.getElementById('members-container')) {
      this.loadMembers();
    } else if (document.getElementById('events-container')) {
      this.loadEvents();
    } else if (document.getElementById('posts-container')) {
      this.loadPosts();
    } else if (document.getElementById('pending-members')) {
      this.loadPendingMembers();
    }
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new CommunityApp();
});