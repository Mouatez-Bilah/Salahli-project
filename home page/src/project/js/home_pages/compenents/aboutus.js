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
      imageUrl: "../../../images/home/data.jpg"
    },
    {
      title: " Reliability & Expertise",
      description: "We collaborate with  qualified repairers to ensure high-quality services.",
      imageUrl: "../../../images/home/reparing.jpg"
    },
    {
      title: "Accessibility & Simplicity",
      description: " Our user-friendly platform makes it easy for users to find a repairer near them",
      imageUrl: "../../../images/home/reparing2.jpg"
    },
    {
      title: "Ecology & Sustainability",
      description: "By promoting repair over replacement, we help reduce electronic waste.",
      imageUrl: "../../../images/home/garbage.jpg"
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
  