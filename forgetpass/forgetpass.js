document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("resetForm");
    const emailInput = document.getElementById("emailInput");
    const inputContainer = document.getElementById("inputContainer");
    const errorMessage = document.getElementById("errorMessage");

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Phone validation regex
    const phoneRegex = /^\+?[0-9]{10,15}$/;

    form.addEventListener("submit", async function (event) {
      event.preventDefault(); // Stop form from submitting normally

      const value = emailInput.value.trim();

      // Check if input is empty
      if (value === "") {
        showError("Please enter an email address or phone number");
        return;
      } 
      // Check if input is NOT an email AND NOT a phone number
      else if (!emailRegex.test(value) && !phoneRegex.test(value)) {
        showError("Please enter a valid email address or phone number");
        return;
      } 

      try {
        // Make API call to request password reset
        const response = await axios.post('http://127.0.0.1:8000/api/request-password-reset/', {
          email_or_phone: value
        });

        if (response.status === 200) {
          // Show success state
          hideError();
          inputContainer.classList.add("success");
          
          // Store the email/phone in localStorage for verification page
          localStorage.setItem("resetEmailOrPhone", value);
          
          // Redirect to verification page after 1 second
          setTimeout(function() {
            window.location.href = "../verify/index.html";
          }, 1000);
        }
      } catch (error) {
        console.error("Password reset request failed:", error);
        if (error.response) {
          // Handle specific error messages from the server
          const errorMsg = error.response.data.detail || "Failed to send reset instructions. Please try again.";
          showError(errorMsg);
        } else {
          showError("Failed to send reset instructions. Please try again.");
        }
      }
    });

    // Clear errors when user starts typing again
    emailInput.addEventListener("input", function () {
      inputContainer.classList.remove("error");
      inputContainer.classList.remove("success");
      errorMessage.classList.remove("visible");
    });

    function showError(message) {
      inputContainer.classList.add("error");
      errorMessage.textContent = message;
      errorMessage.classList.add("visible");
    }

    function hideError() {
      inputContainer.classList.remove("error");
      errorMessage.classList.remove("visible");
    }
  });