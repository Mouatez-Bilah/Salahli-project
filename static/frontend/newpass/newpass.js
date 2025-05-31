document.addEventListener("DOMContentLoaded", function () {
    // Toggle password visibility
    const eyeIcons = document.querySelectorAll(".eye-icon-container");

    eyeIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const inputId = this.getAttribute("data-for");
        const input = document.getElementById(inputId);
        const type = input.type === "password" ? "text" : "password";
        input.type = type;
        
        // Toggle eye icon
        const eyeIcon = this.querySelector('svg');
        if (type === 'password') {
          eyeIcon.innerHTML = `
            <g opacity="0.7">
              <path d="M389.167 51.2396C387.274 51.2396 385.459 51.779 384.12 52.7392C382.782 53.6994 382.03 55.0017 382.03 56.3596C382.03 57.7175 382.782 59.0198 384.12 59.98C385.459 60.9401 387.274 61.4796 389.167 61.4796C391.059 61.4796 392.875 60.9401 394.213 59.98C395.551 59.0198 396.303 57.7175 396.303 56.3596C396.303 55.0017 395.551 53.6994 394.213 52.7392C392.875 51.779 391.059 51.2396 389.167 51.2396ZM389.167 64.8929C386.012 64.8929 382.987 63.9939 380.756 62.3935C378.526 60.7932 377.273 58.6228 377.273 56.3596C377.273 54.0964 378.526 51.9259 380.756 50.3256C382.987 48.7253 386.012 47.8262 389.167 47.8262C392.321 47.8262 395.346 48.7253 397.577 50.3256C399.807 51.9259 401.061 54.0964 401.061 56.3596C401.061 58.6228 399.807 60.7932 397.577 62.3935C395.346 63.9939 392.321 64.8929 389.167 64.8929ZM389.167 43.5596C377.273 43.5596 367.115 48.8673 363 56.3596C367.115 63.8518 377.273 69.1596 389.167 69.1596C401.061 69.1596 411.218 63.8518 415.333 56.3596C411.218 48.8673 401.061 43.5596 389.167 43.5596Z" fill="#162021"></path>
              <line y1="-0.5" x2="53.4546" y2="-0.5" transform="matrix(0.801019 0.598639 -0.823559 0.56723 367.758 41)" stroke="black"></line>
            </g>`;
        } else {
          eyeIcon.innerHTML = `
            <g opacity="0.7">
              <path d="M389.167 51.2396C387.274 51.2396 385.459 51.779 384.12 52.7392C382.782 53.6994 382.03 55.0017 382.03 56.3596C382.03 57.7175 382.782 59.0198 384.12 59.98C385.459 60.9401 387.274 61.4796 389.167 61.4796C391.059 61.4796 392.875 60.9401 394.213 59.98C395.551 59.0198 396.303 57.7175 396.303 56.3596C396.303 55.0017 395.551 53.6994 394.213 52.7392C392.875 51.779 391.059 51.2396 389.167 51.2396ZM389.167 64.8929C386.012 64.8929 382.987 63.9939 380.756 62.3935C378.526 60.7932 377.273 58.6228 377.273 56.3596C377.273 54.0964 378.526 51.9259 380.756 50.3256C382.987 48.7253 386.012 47.8262 389.167 47.8262C392.321 47.8262 395.346 48.7253 397.577 50.3256C399.807 51.9259 401.061 54.0964 401.061 56.3596C401.061 58.6228 399.807 60.7932 397.577 62.3935C395.346 63.9939 392.321 64.8929 389.167 64.8929ZM389.167 43.5596C377.273 43.5596 367.115 48.8673 363 56.3596C367.115 63.8518 377.273 69.1596 389.167 69.1596C401.061 69.1596 411.218 63.8518 415.333 56.3596C411.218 48.8673 401.061 43.5596 389.167 43.5596Z" fill="#162021"></path>
            </g>`;
        }
      });
    });

    // Form validation
    const form = document.getElementById("resetPasswordForm");
    const newPassword = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const newPasswordError = document.getElementById("newPasswordError");
    const confirmPasswordError = document.getElementById(
      "confirmPasswordError",
    );
    const saveButton = document.getElementById("saveButton");
    const tokenInput = document.getElementById("token");

    // Extract token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      tokenInput.value = token;
    } else {
      newPasswordError.textContent = "Invalid or missing token.";
      saveButton.disabled = true;
    }

    // Function to validate password
    function validatePassword() {
      let isValid = true;

      // Clear previous error messages
      newPasswordError.textContent = "";
      confirmPasswordError.textContent = "";

      // Validate new password
      if (newPassword.value.length < 8) {
        newPasswordError.textContent =
          "Password must be at least 8 characters long";
        isValid = false;
      } else if (!/[A-Z]/.test(newPassword.value)) {
        newPasswordError.textContent =
          "Password must contain at least one uppercase letter";
        isValid = false;
      } else if (!/[a-z]/.test(newPassword.value)) {
        newPasswordError.textContent =
          "Password must contain at least one lowercase letter";
        isValid = false;
      } else if (!/[0-9]/.test(newPassword.value)) {
        newPasswordError.textContent =
          "Password must contain at least one number";
        isValid = false;
      } else if (!/[^A-Za-z0-9]/.test(newPassword.value)) {
        newPasswordError.textContent =
          "Password must contain at least one special character";
        isValid = false;
      }

      // Validate confirm password
      if (confirmPassword.value !== newPassword.value) {
        confirmPasswordError.textContent = "Passwords do not match";
        isValid = false;
      }

      // Enable/disable save button
      saveButton.disabled = !isValid;

      return isValid;
    }

    // Add event listeners for input validation
    newPassword.addEventListener("input", validatePassword);
    confirmPassword.addEventListener("input", validatePassword);

    // Form submission
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      if (validatePassword()) {
        const token = tokenInput.value;
        if (!token) {
          newPasswordError.textContent = "Invalid or missing token.";
          return;
        }

        try {
          const response = await axios.post('/api/reset-password/', {
            token: token,
            new_password: newPassword.value
          });

          if (response.data.success) {
            alert('Password reset successful!');
            window.location.href = '/login/';
          }
        } catch (error) {
          alert(error.response?.data?.error || 'An error occurred while resetting your password');
        }
      }
    });
  });