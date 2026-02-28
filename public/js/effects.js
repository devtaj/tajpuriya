// Header scroll effect only
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > lastScrollTop && scrollTop > 100) {
    header.classList.add('hide');
    header.classList.remove('show');
  } else {
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
