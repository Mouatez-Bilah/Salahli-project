// Password toggle function
function pass_text(event) {
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
   
function goback(){
    history.back();
}

// Function to load form data from localStorage
function loadFormData() {
    // Get data from localStorage
    const savedData = localStorage.getItem('repair');
    
    // If we have saved data, fill the form
    if (savedData) {
        const userData = JSON.parse(savedData);
        
        // Fill each input field if it exists in userData
        if (userData.username) document.getElementById('username').value = userData.username;
        if (userData.email) document.getElementById('email').value = userData.email;
        if (userData.phone_number) document.getElementById('phone').value = userData.phone_number;
        if (userData.address) document.getElementById('address').value = userData.address;
        if (userData.skills) document.getElementById('skills').value = userData.skills;
        if (userData.workingHours) document.getElementById('workingHours').value = userData.workingHours;
    }
}

// Function to verify password and enable fields
function verifyPassword() {
    const currentPassword = document.getElementById('password').value;
    const verifyBtn = document.querySelector('.verify-btn');
    const statusDiv = document.querySelector('.verification-status');
    const passwordWrapper = document.querySelector('.password-verify-wrapper');
    
    if (!currentPassword) {
        statusDiv.textContent = 'Please enter your password';
        statusDiv.className = 'verification-status error';
        return;
    }

    // Add verifying state
    verifyBtn.classList.add('verifying');
    verifyBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>Verifying...</span>';
    
    // Simulate a small delay for better UX
    setTimeout(() => {
        const savedData = localStorage.getItem('userPassword');
        
        if (savedData && currentPassword === savedData) {
            // Password is correct
            verifyBtn.classList.remove('verifying');
            verifyBtn.classList.add('verified');
            verifyBtn.innerHTML = '<i class="fa-solid fa-check"></i><span>Verified</span>';
            statusDiv.textContent = 'Password verified successfully!';
            statusDiv.className = 'verification-status success';
            
            // Remove highlight effect
            passwordWrapper.classList.remove('highlight');
            document.getElementById('password').classList.remove('highlight');
            
            // Enable fields
            enableFields();
            
            // Disable password field after successful verification
            document.getElementById('password').setAttribute('readonly', true);
            document.querySelector('.toggle-password').style.display = 'none';
        } else {
            // Password is incorrect
            verifyBtn.classList.remove('verifying');
            verifyBtn.innerHTML = '<i class="fa-solid fa-check"></i><span>Verify</span>';
            statusDiv.textContent = 'Incorrect password. Please try again.';
            statusDiv.className = 'verification-status error';
            
            // Clear password field
            document.getElementById('password').value = '';
            document.getElementById('password').focus();
        }
    }, 800); // 800ms delay for better UX
}

// Function to enable all fields except password
function enableFields() {
    const fields = ['username', 'email', 'phone', 'address', 'skills', 'workingHours', 'newPassword', 'confirmPassword'];
    fields.forEach(field => {
        const input = document.getElementById(field);
        if (input) {
            input.removeAttribute('readonly');
        }
    });
}

// Function to disable all fields except password
function disableFields() {
    const fields = ['username', 'email', 'phone', 'address', 'skills', 'workingHours', 'newPassword', 'confirmPassword'];
    fields.forEach(field => {
        const input = document.getElementById(field);
        if (input) {
            input.setAttribute('readonly', true);
        }
    });
}

// Custom Alert Modal
function showCustomAlert(message, type = 'success', isConfirmation = false, action = '', callback = null) {
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'custom-alert-modal';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'custom-alert-content';
    
    // Create icon based on type
    const icon = document.createElement('i');
    icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    
    // Create message
    const messageText = document.createElement('p');
    messageText.textContent = message;
    
    // Create button container for confirmation dialogs
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'alert-buttons';
    
    if (isConfirmation) {
        // Create Yes button
        const yesButton = document.createElement('button');
        yesButton.className = 'custom-alert-button confirm';
        yesButton.textContent = 'Yes';
        yesButton.onclick = () => {
            modal.remove();
            if (action === 'cancel') {
                window.location.href = '../repair profial/Rprofile.html';
            } else if (action === 'save' && callback) {
                callback();
            }
        };
        
        // Create No button
        const noButton = document.createElement('button');
        noButton.className = 'custom-alert-button cancel';
        noButton.textContent = 'No';
        noButton.onclick = () => {
            modal.remove();
        };
        
        buttonContainer.appendChild(yesButton);
        buttonContainer.appendChild(noButton);
    } else {
        // Create single OK button
        const button = document.createElement('button');
        button.className = 'custom-alert-button';
        button.textContent = 'OK';
        button.onclick = () => {
            modal.remove();
            if (type === 'success') {
                window.location.href = '../repair profial/Rprofile.html';
            }
        };
        buttonContainer.appendChild(button);
    }
    
    // Assemble modal
    modalContent.appendChild(icon);
    modalContent.appendChild(messageText);
    modalContent.appendChild(buttonContainer);
    modal.appendChild(modalContent);
    
    // Add to body
    document.body.appendChild(modal);
    
    // Add show class after a small delay for animation
    setTimeout(() => modal.classList.add('show'), 10);
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load saved form data
    loadFormData();
    
    // Disable all fields except password initially
    disableFields();
    
    // Focus on password input
    const passwordInput = document.getElementById('password');
    const passwordWrapper = document.querySelector('.password-verify-wrapper');
    
    if (passwordInput && passwordWrapper) {
        passwordInput.focus();
        
        // Add click event to all readonly fields
        document.querySelectorAll('input[readonly]').forEach(field => {
            field.addEventListener('click', function() {
                // Only add highlight if password is not verified
                if (document.getElementById('username').hasAttribute('readonly')) {
                    passwordWrapper.classList.add('highlight');
                    passwordInput.focus();
                }
            });
        });
        
        // Add click event to save button
        const saveBtn = document.querySelector('.save-btn:not([style*="background-color: rgb(224 0 0)"])');
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                // Only highlight if password is not verified (fields are still readonly)
                if (document.getElementById('username').hasAttribute('readonly')) {
                    passwordWrapper.classList.add('highlight');
                    passwordInput.focus();
                }
            });
        }
        
        // Remove highlight when user starts typing in password
        passwordInput.addEventListener('input', function() {
            passwordWrapper.classList.remove('highlight');
        });
        
        // Add password verification event listener
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                verifyPassword();
            }
        });
    }

    // Handle cancel button
    const cancelBtn = document.querySelector('.save-btn[style*="background-color: rgb(224 0 0)"]');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Show confirmation dialog
            showCustomAlert('Are you sure you want to cancel? All changes will be discarded.', 'error', true, 'cancel');
        });
    }

    // Form validation and submission
    const form = document.getElementById('editProfileForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Check if fields are enabled (password verified)
            const isEnabled = !document.getElementById('username').hasAttribute('readonly');
            if (!isEnabled) {
                const passwordWrapper = document.querySelector('.password-verify-wrapper');
                if (passwordWrapper) {
                    passwordWrapper.classList.add('highlight');
                    document.getElementById('password').focus();
                }
                showCustomAlert('Please verify your password first!', 'error');
                return;
            }

            let isValid = true;

            // Email validation
            const email = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                showError(email, 'Please enter a valid email address');
                isValid = false;
            } else {
                removeError(email);
            }

            // Phone validation
            const phone = document.getElementById('phone');
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phone.value)) {
                showError(phone, 'Please enter a valid 10-digit phone number');
                isValid = false;
            } else {
                removeError(phone);
            }

            // Password validation if new password is being set
            const newPassword = document.getElementById('newPassword');
            const confirmPassword = document.getElementById('confirmPassword');
            
            if (newPassword.value) {
                if (newPassword.value.length < 8) {
                    showError(newPassword, 'Password must be at least 8 characters long');
                    isValid = false;
                } else {
                    removeError(newPassword);
                }

                if (newPassword.value !== confirmPassword.value) {
                    showError(confirmPassword, 'Passwords do not match');
                    isValid = false;
                } else {
                    removeError(confirmPassword);
                }
            }

            // Address validation
            const address = document.getElementById('address');
            if (address.value.trim().length < 5) {
                showError(address, 'Please enter a valid address');
                isValid = false;
            } else {
                removeError(address);
            }

            if (isValid) {
                // Show save confirmation dialog
                showCustomAlert('Are you sure you want to save these changes?', 'success', true, 'save', async () => {
                    // Get save button and store original text outside try block
                    const saveBtn = document.querySelector('.save-btn:not([style*="background-color: rgb(224 0 0)"])');
                    const originalText = saveBtn.textContent;

                    try {
                        // Show loading state
                        saveBtn.textContent = 'Saving...';
                        saveBtn.disabled = true;

                        // Prepare the data for the API
                        const formData = {
                            username: document.getElementById('username').value,
                            email: email.value,
                            phone_number: phone.value,
                            address: address.value,
                            skills: document.getElementById('skills').value,
                            // workingHours: document.getElementById('workingHours').value
                        };

                        // Add new password if it was changed
                        if (newPassword.value) {
                            formData.password = newPassword.value;
                            localStorage.setItem('userPassword', newPassword.value);
                        }

                        // Make the API request
                        const token = localStorage.getItem("token");
                        console.log(formData);
                        const response = await axios.put('http://127.0.0.1:8000/api/repair-profile/me/', formData, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });

                        if (response.status === 200) {
                            // Get the existing repair data to preserve the average_rating
                            const existingRepair = JSON.parse(localStorage.getItem('repair'));
                            
                            // Update localStorage with new data while preserving average_rating
                            const updatedRepair = {
                                ...formData,
                                average_rating: existingRepair ? existingRepair.average_rating : 0
                            };
                            localStorage.setItem('repair', JSON.stringify(updatedRepair));
                            localStorage.setItem("username", formData.username);
                            
                            // Show success message
                            showCustomAlert('Profile updated successfully!', 'success');
                        } else {
                            throw new Error('Failed to update profile');
                        }
                    } catch (error) {
                        console.error('Error updating profile:', error);
                        showCustomAlert('Failed to update profile. Please try again.', 'error');
                    } finally {
                        // Reset button state
                        saveBtn.textContent = originalText;
                        saveBtn.disabled = false;
                    }
                });
            }
        });
    }

    // Real-time validation
    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                removeError(this);
            }
        });
    });
});

// Helper functions for validation
function showError(input, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');
    
    let errorMessage = formGroup.querySelector('.error-message');
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        formGroup.appendChild(errorMessage);
    }
    errorMessage.textContent = message;
}

function removeError(input) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.remove('error');
    
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.textContent = '';
    }
}

// Toggle password visibility
// document.querySelectorAll('.toggle-password').forEach(button => {
//     button.addEventListener('click', function() {
//         const targetId = this.getAttribute('data-target');
//         const inputField = document.getElementById(targetId);
        
//         if (inputField.type === 'password') {
//             inputField.type = 'text';
//             this.style.opacity = '0.7';
//         } else {
//             inputField.type = 'password';
//             this.style.opacity = '1';
//         }
//     });
// });

// // Form submission handling
// document.getElementById('editProfileForm').addEventListener('submit', function(e) {
//     e.preventDefault();
    
//     // Password validation
//     const newPassword = document.getElementById('newPassword').value;
//     const confirmPassword = document.getElementById('confirmPassword').value;
    
//     if (newPassword && newPassword !== confirmPassword) {
//         alert('New password and confirmation do not match!');
//         return;
//     }
    
//     // In a real app, you would collect all form data and send to server
//     alert('Profile updated successfully!');
    
//     // Optionally redirect back to profile page
//     // window.location.href = 'profile.html';
// });















