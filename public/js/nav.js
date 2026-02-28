function toggleMobileMenu() {
    const menu = document.getElementById('nav-menu');
    menu.classList.toggle('active');
}

function toggleDropdown() {
    document.getElementById('dropdown-menu').classList.toggle('show');
}

window.onclick = function(event) {
    if (!event.target.matches('.dropdown-toggle')) {
        const dropdowns = document.getElementsByClassName('dropdown-menu');
        for (let i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.remove('show');
        }
    }
    
    // Close mobile menu when clicking outside
    if (!event.target.closest('.nav-menu') && !event.target.closest('.mobile-menu-btn')) {
        const menu = document.getElementById('nav-menu');
        if (menu) menu.classList.remove('active');
    }
}
