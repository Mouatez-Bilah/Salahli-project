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
            if (callback) callback();
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
            if (callback) callback();
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

document.addEventListener('DOMContentLoaded', function() {
    // Button click handlers
    const viewRequestsBtn = document.getElementById('viewRequests');
    const myProfileBtn = document.getElementById('myProfile');
    const logoutBtn = document.querySelector('.logout-btn');

    if (viewRequestsBtn) {
        viewRequestsBtn.addEventListener('click', function() {
            location.href = "../tracker/tracker.html";
        });
    }
    
    if (myProfileBtn) {
        myProfileBtn.addEventListener('click', function() {
            location.href = "../new repair request/new-repair-request.html";
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            showCustomAlert('Are you sure you want to log out?', 'error', true, '', () => {
                localStorage.clear();
                location.href = "../log-in/index.html";
            });
        });
    }

    async function getClientProfile() {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get('http://127.0.0.1:8000/api/client-profile/me/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if(response.status >= 200 && response.status < 300) {
                localStorage.setItem("client", JSON.stringify(response.data));
                console.log(response.data);
                
                // Update username display after successful profile fetch
                const username = localStorage.getItem("username");
                const welcomeElement = document.getElementById("wc");
                if (welcomeElement) {
                    welcomeElement.innerHTML = `<h1 class="main-title" id="wc">Welcome ${username}</h1>`;
                }
            } else {
                console.log("Error fetching profile");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // Initialize profile fetch
    getClientProfile();
});