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

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector(".login-form");
  const emailInput = document.querySelector(".email-input");
  const passwordInput = document.querySelector(".password-input");
  const errorMessages = document.querySelectorAll(".error-message");



  // Form submission handler
  form.addEventListener("submit", async function(event) {
    event.preventDefault(); // Always prevent default first
    let isValid = true;
    
    // Validate email - more comprehensive check
    if (false
      // !emailInput.value || !emailInput.validity.valid || !emailInput.checkValidity()
    ) {
      emailInput.parentElement.classList.add("error");
      isValid = false;
    } else {
      emailInput.parentElement.classList.remove("error");
    }
    
    // Validate password - more comprehensive check
    if (!passwordInput.value || !passwordInput.validity.valid || !passwordInput.checkValidity()) {
      passwordInput.parentElement.classList.add("error");
      isValid = false;
    } else {
      passwordInput.parentElement.classList.remove("error");
    }
    
    if (isValid) {
      try{
      
        const signupData = {
          username:  emailInput.value,
          password: passwordInput.value,
        };

        const response = await axios.post('http://127.0.0.1:8000/api/token/', signupData);
        if(response.status >= 200 && response.status < 300){
          console.log('Login successful, storing credentials...');
          console.log('Password being stored:', passwordInput.value);
          
          localStorage.setItem("token", response.data.access);
          localStorage.setItem("username", emailInput.value);
          // Store password for profile editing
          localStorage.setItem("userPassword", passwordInput.value);
          
          console.log('Stored password:', localStorage.getItem('userPassword'));

          // If we get here, the request was successful
          showCustomAlert('Account logged in successfully!', 'success', () => {
            // Redirect to login page after OK is clicked
            window.location.href = '../Repair Dashboard/h.html';
          });
        }else {
          showCustomAlert('login failed . Please try again.', 'error');
        }
      }catch(error)
      
      {console.log(error)
        showCustomAlert('login failed. Please try again.', 'error');

      }
      // Store user data
      
   
      
      // Add a small delay to ensure localStorage is updated
     
      
    }
  });
});

// Password toggle function
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
 