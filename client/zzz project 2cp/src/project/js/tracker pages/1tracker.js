document.addEventListener("DOMContentLoaded", () => {
    const statusMessage = document.getElementById("status-message")
    const hourglassPlaceholder = document.getElementById("hourglass-placeholder")
    const repairImagePlaceholder = document.getElementById("repair-image-placeholder")
    const debugPanel = document.getElementById("debug-panel")
  
    // Debug function - shows errors in a small panel
    function showDebug(message) {
      debugPanel.textContent = message
      debugPanel.classList.remove("hidden")
      console.error(message)
    }
  
    // Function to add hourglass image with spinning animation
    function addHourglassImage(imagePath) {
      // Clear placeholder content
      hourglassPlaceholder.innerHTML = ""
  
      const img = document.createElement("img")
      img.src = imagePath
      img.alt = "Status icon"
      img.className = "w-full h-full object-contain animate-hourglass" // Add animation class
  
      // Handle errors
      img.onerror = () => {
        console.error(`Failed to load hourglass image from: ${imagePath}`)
        hourglassPlaceholder.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2c7a7b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="animate-hourglass">
            <path d="M6 2v6a6 6 0 0 0 6 6 6 6 0 0 0 6-6V2H6Z"></path>
            <path d="M6 22v-6a6 6 0 0 1 6-6 6 6 0 0 1 6 6v6H6Z"></path>
          </svg>
        `
      }
  
      hourglassPlaceholder.appendChild(img)
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
    addHourglassImage("../../images/Vector.png")
    addRepairImage("../../images/reparateur.png")
  })
  