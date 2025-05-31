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
  
    // Function to add accepted status icon
    function addAcceptedIcon(imagePath) {
      // Clear placeholder content
      statusIconPlaceholder.innerHTML = ""
  
      // If you have a specific accepted icon image
      if (imagePath) {
        const img = document.createElement("img")
        img.src = imagePath
        img.alt = "Accepted status"
        img.className = "w-full h-full object-contain"
  
        // Handle errors
        img.onerror = () => {
          console.error(`Failed to load accepted icon from: ${imagePath}`)
          // Fallback to SVG icon
          addAcceptedIconSVG()
        }
  
        statusIconPlaceholder.appendChild(img)
      } else {
        // Use SVG as fallback
        addAcceptedIconSVG()
      }
    }
  
    // Function to add SVG accepted icon as fallback
    function addAcceptedIconSVG() {
      statusIconPlaceholder.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00bfa5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <path d="M9 15l3 3 5-5"></path>
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
      img.className = "w-full h-full object-cover"
  
      // Handle errors
      img.onerror = () => {
        console.error(`Failed to load repair image from: ${imagePath}`)
        repairImagePlaceholder.innerHTML = `
          <div class="text-center text-gray-500 h-full flex items-center justify-center">
            Could not load repair technician image
          </div>
        `
      }
  
      repairImagePlaceholder.appendChild(img)
    }
  
    // Add your images with the exact paths provided
    addAcceptedIcon("../../images/accept.png") // Replace with your accepted icon path
    addRepairImage("../../images/reparateur.png")
  })
  