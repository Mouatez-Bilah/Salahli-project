// Custom alert function
function showCustomAlert(message, type = 'success', onClose = null) {
  const modal = document.createElement('div');
  modal.className = 'custom-alert-modal';
  modal.innerHTML = `
    <div class="custom-alert-content">
      <div class="custom-alert-icon ${type}">
        ${type === 'success' ? 
          '<i class="fas fa-check-circle"></i>' : 
          '<i class="fas fa-exclamation-circle"></i>'}
      </div>
      <p>${message}</p>
      <button class="custom-alert-button">OK</button>
    </div>
  `;

  document.body.appendChild(modal);

  // Show modal with animation
  setTimeout(() => {
    modal.style.opacity = '1';
  }, 10);

  // Handle OK button click
  const okButton = modal.querySelector('.custom-alert-button');
  okButton.addEventListener('click', () => {
    modal.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(modal);
      if (onClose) onClose();
    }, 300);
  });
}

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('registrationForm');
  const passwordInput = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');
  const strengthBar = document.querySelector('.password-strength-bar');
  const strengthText = document.getElementById('strengthText');
  const inputs = form.querySelectorAll('input');

  // Toggle password visibility
  if (togglePassword) {
    togglePassword.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);

      // Toggle the eye icon (crossed out or not)
      const line = this.querySelector('line');
      if (line) {
        line.style.display = type === 'password' ? 'block' : 'none';
      }
    });
  }

  // Check password strength
  if (passwordInput) {
    passwordInput.addEventListener('input', function() {
      const password = this.value;
      const strength = checkPasswordStrength(password);

      // Update strength indicator
      if (strengthBar && strengthText) {
        strengthBar.style.width = strength.percent + '%';
        strengthBar.style.backgroundColor = strength.color;
        strengthText.textContent = strength.text;

        // Add strength class to parent for styling
        const strengthContainer = document.querySelector('.password-strength');
        if (strengthContainer) {
          strengthContainer.className = 'password-strength';
          if (password.length > 0) {
            strengthContainer.classList.add('strength-' + strength.level);
          }
        }
      }
    });
  }

  // Form validation and submission
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      let isValid = true;

      // Check each input
      inputs.forEach(input => {
        if (!validateInput(input)) {
          isValid = false;
        }
      });

      if (isValid) {
        try {
          // Prepare signup data
          const signupData = {
            username: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            phone_number: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            custom_skills:"null"
          };

          // Make API call using Axios
          const response = await axios.post('http://127.0.0.1:8000/api/repair-signup/', signupData);
          console.log('Server response:', response.data);
          if(response.status >= 200 && response.status < 300){
            // If we get here, the request was successful
            showCustomAlert('Account created successfully!', 'success', () => {
              // Redirect to login page after OK is clicked
              window.location.href = '../log-in/index.html';
            });

         }else {
            
            showCustomAlert('Failed to create account. Please try again.', 'error');
          }}catch(error){console.log(error)}

          // if (error.response) {
          //   // Handle validation errors
          //   if (error.response.data.username) {
          //     const errorMessage = error.response.data.username[0];
          //     if (errorMessage.includes('already exists')) {
          //       showCustomAlert('This username is already taken. Please choose a different one.', 'error');
          //     } else {
          //       showCustomAlert(errorMessage, 'error');
          //     }
          //   } else if (error.response.data.email) {
          //     const errorMessage = error.response.data.email[0];
          //     if (errorMessage.includes('already exists')) {
          //       showCustomAlert('This email is already registered. Please use a different email or try logging in.', 'error');
          //     } else {
          //       showCustomAlert(errorMessage, 'error');
          //     }
          //   } else if (error.response.data.detail) {
          //     showCustomAlert(error.response.data.detail, 'error');
          //   } else {
          //     showCustomAlert('Failed to create account. Please try again.', 'error');
          //   }
          // } else {
          //   showCustomAlert('An error occurred during signup', 'error');
          // }
        
      }
    });}
  // Validate on blur
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateInput(this);
    });

    input.addEventListener('input', function() {
      // Remove error state when user starts typing again
      const container = this.closest('.input-container');
      if (container) {
        container.classList.remove('error');
      }
    });
  });
  // Format date input
  const birthdateInput = document.getElementById('birthdate');
  if (birthdateInput) {
    // Set max date to today (no future dates)
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    birthdateInput.setAttribute('max', `${yyyy}-${mm}-${dd}`);

    // Set min date (e.g., must be at least 18 years old)
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 100); // Allow up to 100 years old
    const minYyyy = minDate.getFullYear();
    const minMm = String(minDate.getMonth() + 1).padStart(2, '0');
    const minDd = String(minDate.getDate()).padStart(2, '0');
    birthdateInput.setAttribute('min', `${minYyyy}-${minMm}-${minDd}`);
  }
});

// Validate individual input
function validateInput(input) {
  const container = input.closest('.input-container');
  if (!container) return true;

  let isValid = true;

  // Check if empty
  if (input.hasAttribute('required') && !input.value.trim()) {
    setError(container, 'This field is required');
    isValid = false;
  }
  // Check patterns
  else if (input.hasAttribute('pattern') && input.value.trim()) {
    const pattern = new RegExp(input.getAttribute('pattern'));
    if (!pattern.test(input.value)) {
      setError(container, 'Please enter a valid format');
      isValid = false;
    }
  }
  // Check email format
  else if (input.type === 'email' && input.value.trim()) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(input.value)) {
      setError(container, 'Please enter a valid email address');
      isValid = false;
    }
  }
  // Check address (minimum length)
  else if (input.id === 'address' && input.value.trim()) {
    if (input.value.length < 2) {
      setError(container, 'Please enter a complete address');
      isValid = false;
    }
  }
  // Check password length
  else if (input.type === 'password') {
    if (!input.value.trim()) {
      setError(container, 'Password is required');
      isValid = false;
    } else if (input.value.length < 8) {
      setError(container, 'Password must be at least 8 characters');
      isValid = false;
    }
  }
  // Check date format
  else if (input.type === 'date' && input.value) {
    const dateValue = new Date(input.value);
    if (isNaN(dateValue.getTime())) {
      setError(container, 'Please enter a valid date');
      isValid = false;
    }
  }

  // If valid, remove error class
  if (isValid) {
    container.classList.remove('error');
  }

  return isValid;
}

// Set error message and class
function setError(container, message) {
  container.classList.add('error');
  const errorElement = container.querySelector('.error-message');
  if (errorElement) {
    errorElement.textContent = message;
  }
}

// Check password strength
function checkPasswordStrength(password) {
  // Default values
  let strength = {
    level: 'weak',
    percent: 0,
    text: 'Weak',
    color: '#ff3b30'
  };

  if (!password) {
    strength.text = 'None';
    strength.percent = 0;
    return strength;
  }

  // Calculate strength
  let score = 0;

  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Complexity checks
  if (/[A-Z]/.test(password)) score += 1; // Has uppercase
  if (/[a-z]/.test(password)) score += 1; // Has lowercase
  if (/[0-9]/.test(password)) score += 1; // Has number
  if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special char

  // Determine strength based on score
  if (score <= 2) {
    strength.level = 'weak';
    strength.text = 'Weak';
    strength.percent = 33;
    strength.color = '#ff3b30';
  } else if (score <= 4) {
    strength.level = 'medium';
    strength.text = 'Medium';
    strength.percent = 66;
    strength.color = '#ffcc00';
  } else {
    strength.level = 'strong';
    strength.text = 'Strong';
    strength.percent = 100;
    strength.color = '#34c759';
  }

  return strength;
}

function pass_text() {
  const btn = event.currentTarget;
  const targetId = btn.getAttribute("data-target"); 
  const input = document.getElementById(targetId); 
  const eyeIcon = btn.querySelector('i');

  if (input.type === "password") {
      input.type = "text";
      eyeIcon.classList.remove('fa-eye');
      eyeIcon.classList.add('fa-eye-slash');
  } else {
      input.type = "password";
      eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye');
  }
}