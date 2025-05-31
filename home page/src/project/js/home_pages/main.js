document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // NAVBAR FUNCTIONALITY
  // ==========================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('nav-links');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuPanel = document.getElementById('mobile-menu-panel');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  // More sensitive navbar scroll effect - triggers at 1px instead of 10px
  window.addEventListener('scroll', () => {
    if (window.scrollY > 1) {
      navbar.classList.add('fixed', 'top-0', 'left-0', 'right-0', 'z-50');
    } else {
      navbar.classList.remove('fixed', 'top-0', 'left-0', 'right-0', 'z-50');
    }
  });

  // Mobile menu functions
  const openMobileMenu = () => {
    mobileMenu.classList.remove('hidden');
    setTimeout(() => {
      mobileMenuPanel.classList.remove('translate-x-full');
    }, 10);
  };

  const closeMobileMenu = () => {
    mobileMenuPanel.classList.add('translate-x-full');
    setTimeout(() => {
      mobileMenu.classList.add('hidden');
    }, 300);
  };

  // Mobile menu event listeners
  mobileMenuBtn?.addEventListener('click', openMobileMenu);
  mobileMenuClose?.addEventListener('click', closeMobileMenu);
  
  // Close menu when clicking outside the panel
  mobileMenu?.addEventListener('click', (e) => {
    // Only close if the click is outside the panel
    if (!mobileMenuPanel.contains(e.target) && e.target !== mobileMenuBtn) {
      closeMobileMenu();
    }
  });

  // Close menu when clicking nav links
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
      closeMobileMenu();
    }
  });

  // ==========================================
  // JOIN US MODAL FUNCTIONALITY
  // ==========================================
  const joinUsBtn = document.getElementById('join-us-btn');
  const joinUsBtnMobile = document.getElementById('join-us-btn-mobile');
  const joinUsModal = document.getElementById('join-us-modal');
  const joinUsModalContent = document.getElementById('join-us-modal-content');
  const closeJoinModal = document.getElementById('close-join-modal');
  const joinAsRepairer = document.getElementById('join-as-repairer');
  const joinAsClient = document.getElementById('join-as-client');

  // Open modal functions
  const openJoinModal = () => {
    joinUsModal.classList.remove('hidden');
    setTimeout(() => {
      joinUsModalContent.classList.remove('scale-95');
      joinUsModalContent.classList.add('scale-100');
    }, 10);
  };

  // Close modal functions
  const closeJoinModalFunc = () => {
    joinUsModalContent.classList.remove('scale-100');
    joinUsModalContent.classList.add('scale-95');
    setTimeout(() => {
      joinUsModal.classList.add('hidden');
    }, 300);
  };

  // Event listeners for opening modal
  joinUsBtn?.addEventListener('click', openJoinModal);
  joinUsBtnMobile?.addEventListener('click', openJoinModal);

  // Event listeners for closing modal
  closeJoinModal?.addEventListener('click', closeJoinModalFunc);

  // Close modal when clicking outside the content
  joinUsModal?.addEventListener('click', (e) => {
    // Only close if the click is outside the modal content
    if (!joinUsModalContent.contains(e.target) && 
        e.target !== joinUsBtn && 
        e.target !== joinUsBtnMobile) {
      closeJoinModalFunc();
    }
  });

  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !joinUsModal.classList.contains('hidden')) {
      closeJoinModalFunc();
    }
  });

  // Handle join options
  joinAsRepairer?.addEventListener('click', () => {
    // Add your logic for joining as repairer
    
   
    window.location.href = '../../../../../repair/sign-up/index.html';
    closeJoinModalFunc();
    // You can redirect to a registration page here
  });

  joinAsClient?.addEventListener('click', () => {
    // Add your logic for joining as client
    
    
    window.location.href = '../../../../../client2/sign-up/index.html';
    closeJoinModalFunc();
    // You can redirect to a registration page here
  });

  // ==========================================
  // HERO SECTION FUNCTIONALITY
  // ==========================================
  // Set single background image
  document.getElementById('hero-bg').style.backgroundImage = "url('../../images/home/homescreen.jpg')";

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

  // ==========================================
  // ABOUT US FUNCTIONALITY
  // ==========================================
  const stats = [
    {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
      value: "+ 500",
      label: "Registered Qualified Repairers"
    },
    {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/></svg>`,
      value: "95 %",
      label: "Satisfied Customers"
    },
    {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
      value: "58",
      label: "wilayas covered"
    }
  ];
  
  const valuesData = [
    {
      title: "Innovation & Technology",
      description: "With geolocation and remote diagnostics, we streamline and speed up the repair process.",
      imageUrl: "../../images/home/data.jpg"
    },
    {
      title: " Reliability & Expertise",
      description: "We collaborate with  qualified repairers to ensure high-quality services.",
      imageUrl: "../../images/home/reparing.jpg"
    },
    {
      title: "Accessibility & Simplicity",
      description: " Our user-friendly platform makes it easy for users to find a repairer near them",
      imageUrl: "../../images/home/reparing2.jpg"
    },
    {
      title: "Ecology & Sustainability",
      description: "By promoting repair over replacement, we help reduce electronic waste.",
      imageUrl: "../../images/home/garbage.jpg"
    }
  ];
  
  let currentSlide = 0;
  let isAnimating = false;
  
  const updateValueContent = () => {
    const { title, description, imageUrl } = valuesData[currentSlide];
    document.getElementById('value-title').textContent = title;
    document.getElementById('value-description').textContent = description;
    document.getElementById('value-image').src = imageUrl;
  };
  
  const changeSlide = (index) => {
    if (isAnimating) return;
    isAnimating = true;
  
    const content = document.getElementById('value-content');
    content.style.opacity = 0;
  
    setTimeout(() => {
      currentSlide = index;
      updateValueContent();
      content.style.opacity = 1;
      isAnimating = false;
    }, 500);
  };
  
  document.getElementById('prev-slide').addEventListener('click', () => {
    const prevIndex = currentSlide === 0 ? valuesData.length - 1 : currentSlide - 1;
    changeSlide(prevIndex);
  });
  
  document.getElementById('next-slide').addEventListener('click', () => {
    const nextIndex = currentSlide === valuesData.length - 1 ? 0 : currentSlide + 1;
    changeSlide(nextIndex);
  });
  
  // Populate stats
  const statsContainer = document.getElementById('stats-container');
  stats.forEach(stat => {
    const div = document.createElement('div');
    div.className = 'flex items-center mb-6 md:mb-0';
    div.innerHTML = `
      <div class="bg-gray-800 p-4 rounded-lg mr-4 text-white cursor-pointer hover:text-[#6f958e] transition-all duration-500">
        ${stat.icon}
      </div>
      <div>
        <p class="text-2xl font-bold">${stat.value}</p>
        <p class="text-gray-700 hover:text-[#6f958e] transition-all duration-500">${stat.label}</p>
      </div>
    `;
    statsContainer.appendChild(div);
  });
  
  // Initialize first value
  updateValueContent();

  // ==========================================
  // OUR SERVICE FUNCTIONALITY
  // ==========================================
  const serviceStats = [
    {
      imagePath: "../../images/home/delivery.png",
      value: "Delivery & Repair",
      label:
        "We offer a delivery service to pick up and return your device after repair. No need to travel— we take care of transportation safely and efficiently.",
    },
    {
      imagePath: "../../images/home/star.png",
      value: "Repairer rating",
      label:
        "Each repair technician receives a rating based on customer reviews. A ranking system ensures the highest quality of service for consumers.",
    },
  ];

  const serviceStatsContainer = document.getElementById("service-stats-container");
  serviceStats.forEach((stat) => {
    const div = document.createElement("div");
    div.className = "flex flex-col md:flex-row items-start gap-3 mb-4 md:mb-0 flex-1";
    div.innerHTML = `
      <div class="bg-gray-700 p-3 rounded-lg mr-2 text-white self-start hover:text-[#6f958e]">
        <img src="${stat.imagePath}" alt="Stat icon" class="w-8 h-8 filter brightness-0 invert">
      </div>
      <div class="flex-1">
        <p class="text-lg font-bold mb-1">${stat.value}</p>
        <p class="text-gray-700 text-xs leading-relaxed max-w-md">${stat.label}</p>
      </div>
    `;
    serviceStatsContainer.appendChild(div);
  });

  // ==========================================
  // CONTACT US FUNCTIONALITY
  // ==========================================
  // Smooth scroll for internal links
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // Add click tracking for social media links (optional)
  const socialLinks = document.querySelectorAll('footer a[href="#"]');
  socialLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      // Replace with your actual social media URLs
      const icon = this.querySelector("i");
      if (icon.classList.contains("fa-facebook-f")) {
        window.open("https://facebook.com/yourpage", "_blank");
      } else if (icon.classList.contains("fa-instagram")) {
        window.open("https://instagram.com/yourpage", "_blank");
      } else if (icon.classList.contains("fa-twitter")) {
        window.open("https://twitter.com/yourpage", "_blank");
      } else if (icon.classList.contains("fa-whatsapp")) {
        window.open("https://wa.me/213XXXXXXXXX", "_blank");
      }
    });
  });
});