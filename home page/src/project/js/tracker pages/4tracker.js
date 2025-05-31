document.addEventListener("DOMContentLoaded", () => {
    const statusMessage = document.getElementById("status-message")
    const statusIconPlaceholder = document.getElementById("status-icon-placeholder")
    const repairImagePlaceholder = document.getElementById("repair-image-placeholder")
    const debugPanel = document.getElementById("debug-panel")
  
    // Debug function - shows errors in a small panel
    function showDebug(message) {
      debugPanel.textContent = message
      debugPanel.classList.remove("hidden")
      console.error(message)
    }
  
    // Function to add rejected status icon
    function addRejectedIcon(imagePath) {
      // Clear placeholder content
      statusIconPlaceholder.innerHTML = ""
  
      // If you have a specific rejected icon image
      if (imagePath) {
        const img = document.createElement("img")
        img.src = imagePath
        img.alt = "Rejected status"
        img.className = "w-full h-full object-contain"
  
        // Handle errors
        img.onerror = () => {
          console.error(`Failed to load rejected icon from: ${imagePath}`)
          // Fallback to SVG icon
          addRejectedIconSVG()
        }
  
        statusIconPlaceholder.appendChild(img)
      } else {
        // Use SVG as fallback
        addRejectedIconSVG()
      }
    }
  
    // Function to add SVG rejected icon as fallback
    function addRejectedIconSVG() {
      statusIconPlaceholder.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#718096" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="9" x2="15" y2="15"></line>
          <line x1="15" y1="9" x2="9" y2="15"></line>
        </svg>
      `
    }
  
    // Function to add repair technician image
    function addRepairImage(imagePath) {
      // Clear placeholder content
      repairImagePlaceholder.innerHTML = ""
  
      const img = document.createElement("img")
      img.src = imagePath
      img.alt = "Repair technician"
      img.className = "w-full h-full object-cover rounded-lg"
  
      // Handle errors
      img.onerror = () => {
        console.error(`Failed to load repair image from: ${imagePath}`)
        repairImagePlaceholder.innerHTML = `
          <div class="text-center text-gray-500 h-full flex items-center justify-center">
            Could not load repair technician image
          </div>
        `
      }
  
      // Add hover effect
      img.onload = () => {
        img.style.transition = "transform 0.3s ease"
      }
  
      img.onmouseenter = () => {
        img.style.transform = "scale(1.02)"
      }
  
      img.onmouseleave = () => {
        img.style.transform = "scale(1)"
      }
  
      repairImagePlaceholder.appendChild(img)
    }
  
    // Add your images with the exact paths provided
    addRejectedIcon("../../images/exclamation.png") // Replace with your rejected icon path
    addRepairImage("../../images/reparateur.png")
  })
  