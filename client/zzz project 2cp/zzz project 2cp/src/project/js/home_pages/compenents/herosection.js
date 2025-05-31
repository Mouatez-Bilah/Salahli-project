// Set background images
document.getElementById('hero-bg').style.backgroundImage = "url('../../../images/home/homescreen.jpg')";
document.getElementById('tools-bg').style.backgroundImage = "url('../assets/images/tools-background.jpg')";

// Button hover animation
const contactBtn = document.getElementById('contact-btn');
contactBtn.addEventListener('mouseenter', () => {
  contactBtn.classList.add('scale-105', 'shadow-lg');
  contactBtn.classList.remove('scale-100');
});
contactBtn.addEventListener('mouseleave', () => {
  contactBtn.classList.remove('scale-105', 'shadow-lg');
  contactBtn.classList.add('scale-100');
});

// Technician image hover effect (optional)
const technicianImg = document.getElementById('technician-img');
technicianImg?.addEventListener('mouseenter', () => {
  technicianImg.style.transform = 'scale(1.05)';
});
technicianImg?.addEventListener('mouseleave', () => {
  technicianImg.style.transform = 'scale(1)';
});