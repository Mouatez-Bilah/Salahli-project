const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    navbar.classList.add('fixed', 'top-0', 'left-0', 'right-0', 'z-50');
  } else {
    navbar.classList.remove('fixed', 'top-0', 'left-0', 'right-0', 'z-50');
  }
});