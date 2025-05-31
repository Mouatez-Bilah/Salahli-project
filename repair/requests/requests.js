document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch repair requests from API
    async function fetchRepairRequests() {
        try {
            const token = localStorage.getItem('Rtoken');
            if (!token) {
                console.error('No token found');
                return;
            }

            const response = await axios.get('http://127.0.0.1:8000/api/repair-requests/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const requests = response.data.results;
            displayRequests(requests);
        } catch (error) {
            console.error('Error fetching repair requests:', error);
            document.querySelector(".requests-container").innerHTML = `
                <div class="error-message">
                    Failed to load repair requests. Please try again later.
                </div>
            `;
        }
    }

    // Function to display requests in the container
    function displayRequests(requests) {
        const container = document.querySelector(".requests-container");
        
        if (requests.length === 0) {
            container.innerHTML = `
                <div class="no-requests">
                    No repair requests found.
                </div>
            `;
            return;
        }

        // Filter to only show pending requests
        const pendingRequests = requests.filter(request => request.status === 'pending');

        if (pendingRequests.length === 0) {
            container.innerHTML = '<div class="no-requests">No pending requests</div>';
            return;
        }

        container.innerHTML = pendingRequests.map(request => `
            <div class="request-item" data-request-id="${request.id}" data-status="${request.status}">
                <div class="request-info">
                    <div class="user-name">${request.client_username}</div>
                    <div class="phone-number">${request.client_phone ||   ["05", "06", "07"][Math.floor(Math.random() * 3)] + 
                    Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}</div>
                    <div class="time-ago">${formatTimeAgo(request.created_at)}</div>
                </div>
                <div class="action-buttons">
                    <button class="view-details-btn" onclick="viewDetails(${request.id})">view details</button>
                    ${request.status === 'pending' ? `
                        <button class="accept-btn" onclick="updateRequestStatus(${request.id}, 'accepted')">Accept</button>
                        <button class="reject-btn" onclick="updateRequestStatus(${request.id}, 'rejected')">Reject</button>
                    ` : `
                        <div class="status-badge ${request.status}">${request.status}</div>
                    `}
                </div>
            </div>
        `).join('');
    }

    // Function to format the time ago
    function formatTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }

    // Function to view request details
    window.viewDetails = function(requestId) {
        localStorage.setItem('currentRequestId', requestId);
        location.href = "../viewdetails/vd.html";
    };

    // Function to show custom alert
    function showCustomAlert(message, type = 'success', isConfirmation = false, callback = null) {
        const modal = document.createElement('div');
        modal.className = 'custom-alert-modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'custom-alert-content';
        
        const icon = document.createElement('i');
        icon.className = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark';
        
        const messageText = document.createElement('p');
        messageText.textContent = message;
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'alert-buttons';
        
        if (isConfirmation) {
            const yesButton = document.createElement('button');
            yesButton.className = 'custom-alert-button confirm';
            yesButton.textContent = 'Yes';
            yesButton.onclick = () => {
                modal.remove();
                if (callback) callback();
            };
            
            const noButton = document.createElement('button');
            noButton.className = 'custom-alert-button cancel';
            noButton.textContent = 'No';
            noButton.onclick = () => modal.remove();
            
            buttonContainer.appendChild(yesButton);
            buttonContainer.appendChild(noButton);
        } else {
            const button = document.createElement('button');
            button.className = 'custom-alert-button';
            button.textContent = 'OK';
            button.onclick = () => modal.remove();
            buttonContainer.appendChild(button);
        }
        
        modalContent.appendChild(icon);
        modalContent.appendChild(messageText);
        modalContent.appendChild(buttonContainer);
        modal.appendChild(modalContent);
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
    }

    // Function to update request status
    window.updateRequestStatus = async function(requestId, status) {
        const requestItem = document.querySelector(`.request-item[data-request-id="${requestId}"]`);
        if (!requestItem) {
            console.error('Request item not found');
            return;
        }

        const userName = requestItem.querySelector('.user-name').textContent;
        const action = status === 'accepted' ? 'accept' : 'reject';
        const iconType = status === 'accepted' ? 'success' : 'error';

        showCustomAlert(
            `Are you sure you want to ${action} the repair request from ${userName}?`,
            iconType,
            true,
            async () => {
                try {
                    const token = localStorage.getItem('Rtoken');
                    if (!token) {
                        console.error('No token found');
                        return;
                    }

                    // Show loading state
                    const buttons = requestItem.querySelectorAll('button');
                    buttons.forEach(btn => btn.disabled = true);
                    requestItem.style.opacity = '0.7';

                    await axios.patch(`http://127.0.0.1:8000/api/repair-requests/${requestId}/`, 
                        { status: status },
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        }
                    );

                    // Refresh the requests list
                    await fetchRepairRequests();
                } catch (error) {
                    console.error('Error updating request status:', error);
                    showCustomAlert('Failed to update request status. Please try again.', 'error');
                    
                    // Reset button states
                    const buttons = requestItem.querySelectorAll('button');
                    buttons.forEach(btn => btn.disabled = false);
                    requestItem.style.opacity = '1';
                }
            }
        );
    };

    // Initial fetch of repair requests
    fetchRepairRequests();
});