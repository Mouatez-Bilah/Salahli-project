// Password visibility toggle
function pass_text() {
  const passwordInput = document.getElementById('password');
  const toggleButton = document.querySelector('.toggle-password i');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleButton.classList.remove('fa-eye');
    toggleButton.classList.add('fa-eye-slash');
  } else {
    passwordInput.type = 'password';
    toggleButton.classList.remove('fa-eye-slash');
    toggleButton.classList.add('fa-eye');
  }
}

// Form validation and submission
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.login-form');
  const emailInput = document.querySelector('.email-input');
  const passwordInput = document.querySelector('.password-input');

  // Show custom alert
  function showAlert(message, type = 'success') {
    const alertModal = document.createElement('div');
    alertModal.className = 'custom-alert-modal';
    alertModal.style.display = 'block';
    
    alertModal.innerHTML = `
      <div class="custom-alert-content">
        <div class="custom-alert-icon ${type}">
          <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        </div>
        <p>${message}</p>
      </div>
      <button class="custom-alert-button">OK</button>
    `;
    
    document.body.appendChild(alertModal);
    
    const okButton = alertModal.querySelector('.custom-alert-button');
    okButton.addEventListener('click', () => {
      alertModal.remove();
      if (type === 'success') {
        window.location.href = 'dashboard.html'; // Redirect to dashboard on success
      }
    });
  }

  // Form validation
  function validateForm() {
    let isValid = true;
    
    // Email validation
    if (!emailInput.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      emailInput.parentElement.classList.add('error');
      isValid = false;
    } else {
      emailInput.parentElement.classList.remove('error');
    }
    
    // Password validation
    if (passwordInput.value.length < 8) {
      passwordInput.parentElement.classList.add('error');
      isValid = false;
    } else {
      passwordInput.parentElement.classList.remove('error');
    }
    
    return isValid;
  }

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showAlert('Please check your input and try again.', 'error');
      return;
    }
    
    try {
      // Replace with your actual API endpoint
      const response = await axios.post('YOUR_API_ENDPOINT/login', {
        email: emailInput.value,
        password: passwordInput.value
      });
      
      if (response.data.success) {
        // Store the token or user data if needed
        localStorage.setItem('clientToken', response.data.token);
        showAlert('Login successful! Redirecting...', 'success');
      } else {
        showAlert('Invalid credentials. Please try again.', 'error');
      }
    } catch (error) {
      showAlert('An error occurred. Please try again later.', 'error');
      console.error('Login error:', error);
    }
  });

  // Real-time validation
  emailInput.addEventListener('input', () => {
    if (emailInput.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      emailInput.parentElement.classList.remove('error');
    }
  });

  passwordInput.addEventListener('input', () => {
    if (passwordInput.value.length >= 8) {
      passwordInput.parentElement.classList.remove('error');
    }
  });
}); 