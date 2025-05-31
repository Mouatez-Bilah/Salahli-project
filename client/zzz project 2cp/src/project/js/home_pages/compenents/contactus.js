// Add any interactive functionality here if needed
document.addEventListener("DOMContentLoaded", () => {
  // Smooth scroll for internal links
  const links = document.querySelectorAll('a[href^="#"]')

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        })
      }
    })
  })

  // Add click tracking for social media links (optional)
  const socialLinks = document.querySelectorAll('footer a[href="#"]')
  socialLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      // Replace with your actual social media URLs
      const icon = this.querySelector("i")
      if (icon.classList.contains("fa-facebook-f")) {
        window.open("https://facebook.com/yourpage", "_blank")
      } else if (icon.classList.contains("fa-instagram")) {
        window.open("https://instagram.com/yourpage", "_blank")
      } else if (icon.classList.contains("fa-twitter")) {
        window.open("https://twitter.com/yourpage", "_blank")
      } else if (icon.classList.contains("fa-linkedin-in")) {
        window.open("https://linkedin.com/company/yourpage", "_blank")
      } else if (icon.classList.contains("fa-whatsapp")) {
        window.open("https://wa.me/213XXXXXXXXX", "_blank")
      }
    })
  })
})
