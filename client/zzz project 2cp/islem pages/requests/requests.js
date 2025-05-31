document.addEventListener("DOMContentLoaded", () => {
    // Sample data with ratings
    const repairers = [
      { username: "repairer name", phone: "+213676561423", rating: 5.0 },
      { username: "repairer name", phone: "+213558133956", rating: 4.0 },
      { username: "repairer name", phone: "+213555287653", rating: 4.0 },
      { username: "repairer name", phone: "+213798091102", rating: 3.0 },
      { username: "repairer name", phone: "+21379834502", rating: 2.0 },
      { username: "repairer name", phone: "+21379834503", rating: 1.0 },
    ]
  
    // Sort repairers by rating (highest first)
    repairers.sort((a, b) => b.rating - a.rating)
  
    const requestsContainer = document.querySelector(".requests-container")
  
    // Generate star HTML based on rating
    function generateStars(rating) {
      let starsHTML = ""
      for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
          starsHTML += '<span class="star filled">★</span>'
        } else {
          starsHTML += '<span class="star">★</span>'
        }
      }
      return starsHTML
    }
  
    // Render repairers list
    repairers.forEach((repairer) => {
      const repairerHTML = `
              <div class="repairer-item">
                  <div class="photo-placeholder">Photo</div>
                  <div class="repairer-info">
                      <div class="repairer-name">${repairer.username}</div>
                      <div class="rating">
                          <span class="rating-number">${repairer.rating.toFixed(1)}</span>
                          <div class="stars">
                              ${generateStars(repairer.rating)}
                          </div>
                      </div>
                      <div class="phone-number">${repairer.phone}</div>
                  </div>
                  <div class="action-buttons">
                      <button class="profile-btn">Profile</button>
                      <button class="select-btn">select</button>
                  </div>
              </div>
          `
  
      requestsContainer.innerHTML += repairerHTML
    })
  
    // Profile button click handler
    const profileBtns = document.querySelectorAll(".profile-btn")
    profileBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const repairerItem = this.closest(".repairer-item")
        const repairerName = repairerItem.querySelector(".repairer-name").textContent
        alert(`Viewing profile of ${repairerName}`)
        // location.href="../profile/profile.html"
      })
    })
  
    // Select button click handler
    const selectBtns = document.querySelectorAll(".select-btn")
    selectBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const repairerItem = this.closest(".repairer-item")
        const repairerName = repairerItem.querySelector(".repairer-name").textContent
        if (confirm(`Select ${repairerName} as your repairer?`)) {
          alert(`Repairer selected`)
          // location.href="../confirmation/confirmation.html"
        }
      })
    })
  
    // Filter button click handler
    const filterBtn = document.querySelector(".filter-btn")
    if (filterBtn) {
      filterBtn.addEventListener("click", () => {
        alert("Filter options would appear here")
      })
    }
  })
  
  