// Enhanced Interactive Effects - Mutton.world Style

// Header scroll effect - hide on scroll up, show on scroll down
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > lastScrollTop && scrollTop > 100) {
    // Scrolling down
    header.classList.add('hide');
    header.classList.remove('show');
  } else {
    // Scrolling up
    header.classList.remove('hide');
    header.classList.add('show');
  }
  
  if (scrollTop > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  lastScrollTop = scrollTop;
});

// Cursor trail effect
document.addEventListener('mousemove', (e) => {
  if (window.innerWidth > 768) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = e.pageX + 'px';
    trail.style.top = e.pageY + 'px';
    document.body.appendChild(trail);
    
    setTimeout(() => trail.remove(), 500);
  }
});

// Scroll reveal animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  // Add scroll reveal to sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.add('scroll-reveal');
    observer.observe(section);
  });

  // Add floating shapes to body
  const shapesContainer = document.createElement('div');
  shapesContainer.className = 'floating-shapes';
  for (let i = 0; i < 5; i++) {
    const shape = document.createElement('div');
    shape.className = 'shape';
    shapesContainer.appendChild(shape);
  }
  document.body.appendChild(shapesContainer);

  // Add wiggle effect to buttons
  document.querySelectorAll('.btn-primary, .btn-solid').forEach(btn => {
    btn.classList.add('btn-wiggle');
  });

  // Parallax effect on hero
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });

  // Add bounce animation to section titles
  const titles = document.querySelectorAll('.section-title');
  titles.forEach((title, index) => {
    setTimeout(() => {
      title.style.animation = 'fadeInUp 0.8s ease forwards';
    }, index * 200);
  });

  // Interactive card tilt effect
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add loading animation
  window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.5s ease';
      document.body.style.opacity = '1';
    }, 100);
  });

  // Random color change on logo hover
  const logo = document.querySelector('.logo');
  if (logo) {
    const colors = ['var(--primary-color)', 'var(--secondary-color)', 'var(--accent-color)', 'var(--purple)', 'var(--blue)'];
    logo.addEventListener('mouseenter', () => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      logo.style.color = randomColor;
    });
  }

  // Add ripple effect to buttons
  document.querySelectorAll('.btn-primary, .btn-solid, .btn-outline').forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
});

// Add ripple CSS dynamically
const style = document.createElement('style');
style.textContent = `
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .btn-primary, .btn-solid, .btn-outline {
    position: relative;
    overflow: hidden;
  }
`;
document.head.appendChild(style);
