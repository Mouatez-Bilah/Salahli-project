document.addEventListener('DOMContentLoaded', () => {
    const statusIcon = document.getElementById('status-icon');
    const statusMessage = document.getElementById('status-message');
    const repairerDetailsCard = document.getElementById('repairer-details-card');
    const repairerPhoto = document.getElementById('repairer-photo');
    const repairerName = document.getElementById('repairer-name');
    const repairerRating = document.getElementById('repairer-rating');
    const repairerPhone = document.getElementById('repairer-phone');
    const confirmDeliveryBtn = document.getElementById('confirm-delivery-btn');
    const backButton = document.querySelector('.back-button');

    const requestsListContainer = document.querySelector('.repair-requests-list-container');
    const loadingSpinner = requestsListContainer.querySelector('.loading-spinner');
    const errorMessageElement = requestsListContainer.querySelector('.error-message');
    const statusSection = document.querySelector('.status-section');

    let isViewingDetails = false;

    // Function to show loading spinner for the list
    const showLoading = () => {
        if (loadingSpinner) loadingSpinner.style.display = 'flex';
        if (requestsListContainer) {
            requestsListContainer.style.display = 'flex';
            requestsListContainer.classList.remove('active');
        }
        if (errorMessageElement) errorMessageElement.style.display = 'none';
        if (statusSection) statusSection.style.display = 'none';
    };

    // Function to hide loading spinner for the list
    const hideLoading = () => {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    };

    // Function to show error message for the list
    const showError = (message) => {
        if (errorMessageElement) {
            errorMessageElement.textContent = message;
            errorMessageElement.style.display = 'block';
        }
        hideLoading();
        if (requestsListContainer) requestsListContainer.innerHTML = '';
        if (statusSection) statusSection.style.display = 'none';
    };

    // Function to create star icons
    const createStars = (rating) => {
        let starsHtml = '';
        const roundedRating = Math.round(rating);
        for (let i = 0; i < 5; i++) {
            starsHtml += `<div class="star" style="color: ${i < roundedRating ? '#ffc107' : '#ccc'};")>★</div>`;
        }
        return starsHtml;
    };

    // Function to render the list of repair requests
    const renderRepairRequests = (requests) => {
        if (requestsListContainer) {
            requestsListContainer.innerHTML = '';

            if (requests.length === 0) {
                requestsListContainer.innerHTML = `
                    <div class="no-requests-container">
                        <i class="fas fa-tools no-requests-icon"></i>
                        <p class="no-requests-message">No repair requests found</p>
                        <p class="no-requests-submessage">Your repair requests will appear here</p>
                    </div>
                `;
                return;
            }

            requests.forEach(request => {
                console.log('Rendering request:', request);
                const requestCard = document.createElement('div');
                requestCard.classList.add('repair-request-card');
                requestCard.dataset.requestId = request.id;

                let statusText = 'Pending';
                let statusClass = 'status-pending';
                let statusIcon = '⏳';

                if (request.status === 'accepted') {
                    statusText = 'Accepted';
                    statusClass = 'status-accepted';
                    statusIcon = '✓';
                } else if (request.status === 'rejected') {
                    statusText = 'Rejected';
                    statusClass = 'status-rejected';
                    statusIcon = '✕';
                }

                requestCard.innerHTML = `
                    <div class="request-card-header">
                        <div class="request-id">Request #${request.id}</div>
                        <div class="request-status ${statusClass}">
                            <span class="status-icon">${statusIcon}</span>
                            ${statusText}
                        </div>
                    </div>
                    <div class="request-card-body">
                        <div class="request-info">
                            <div class="info-item">
                                <i class="fas fa-laptop"></i>
                                <span>${request.device_type || 'N/A'}</span>
                            </div>
                            <div class="info-item description">
                                <i class="fas fa-info-circle"></i>
                                <span>${request.description ? request.description.substring(0, 100) + '...' : 'N/A'}</span>
                            </div>
                            ${request.repair_username ? 
                                `<div class="info-item repairer">
                                    <i class="fas fa-user-tie"></i>
                                    <span>Repairer: ${request.repair_username}</span>
                                </div>` : ''}
                        </div>
                        <div class="request-actions">
                            <button class="view-details-btn" data-request-id="${request.id}">
                                <i class="fas fa-eye"></i>
                                View Details
                            </button>
                            <button class="delete-request-btn" data-request-id="${request.id}">
                                <i class="fas fa-trash"></i>
                                Delete
                            </button>
                        </div>
                    </div>
                `;

                requestsListContainer.appendChild(requestCard);
            });

            // Add event listeners to view details buttons
            requestsListContainer.querySelectorAll('.view-details-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const requestId = e.target.closest('.view-details-btn').dataset.requestId;
                    displaySingleRequestDetails(requestId);
                });
            });

            // Add event listeners to delete buttons
            requestsListContainer.querySelectorAll('.delete-request-btn').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const requestId = e.target.closest('.delete-request-btn').dataset.requestId;
                    
                    // Create and show confirmation dialog
                    const dialog = document.createElement('div');
                    dialog.className = 'confirmation-dialog';
                    dialog.innerHTML = `
                        <h3>Delete Request</h3>
                        <p>Are you sure you want to delete this request? This action cannot be undone.</p>
                        <div class="confirmation-dialog-buttons">
                            <button class="cancel-btn">Cancel</button>
                            <button class="confirm-btn">Delete</button>
                        </div>
                    `;

                    const overlay = document.createElement('div');
                    overlay.className = 'dialog-overlay';
                    document.body.appendChild(overlay);
                    document.body.appendChild(dialog);

                    // Handle cancel button
                    dialog.querySelector('.cancel-btn').addEventListener('click', () => {
                        document.body.removeChild(dialog);
                        document.body.removeChild(overlay);
                    });

                    // Handle confirm button
                    dialog.querySelector('.confirm-btn').addEventListener('click', async () => {
                        try {
                            const token = localStorage.getItem('token');
                            if (!token) {
                                throw new Error('No authentication token found');
                            }

                            await axios.delete(`http://127.0.0.1:8000/api/repair-requests/${requestId}/`, {
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            });

                            // Remove the request card from the DOM
                            const requestCard = e.target.closest('.repair-request-card');
                            requestCard.remove();

                            // Remove dialog and overlay
                            document.body.removeChild(dialog);
                            document.body.removeChild(overlay);

                            // Show custom success message
                            const successDialog = document.createElement('div');
                            successDialog.className = 'confirmation-dialog';
                            successDialog.innerHTML = `
                                <h3>Success</h3>
                                <p>Request deleted successfully</p>
                                <div class="confirmation-dialog-buttons">
                                    <button class="confirm-btn">OK</button>
                                </div>
                            `;

                            const successOverlay = document.createElement('div');
                            successOverlay.className = 'dialog-overlay';
                            document.body.appendChild(successOverlay);
                            document.body.appendChild(successDialog);

                            // Handle OK button
                            successDialog.querySelector('.confirm-btn').addEventListener('click', () => {
                                document.body.removeChild(successDialog);
                                document.body.removeChild(successOverlay);
                            });

                            // Refresh the list
                            fetchClientRepairRequests();

                        } catch (error) {
                            console.error('Error deleting request:', error);
                            alert('Failed to delete request. Please try again.');
                            // Remove dialog and overlay on error
                            document.body.removeChild(dialog);
                            document.body.removeChild(overlay);
                        }
                    });
                });
            });
        }
    };

    // Function to fetch all repair requests for the logged-in client
    const fetchClientRepairRequests = async () => {
        showLoading();
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.get('http://127.0.0.1:8000/api/repair-requests/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const repairRequests = response.data.results;
            console.log('Fetched repair requests:', repairRequests);
            
            if (requestsListContainer) {
                requestsListContainer.style.display = 'flex';
                requestsListContainer.classList.add('active');
            }
            
            renderRepairRequests(repairRequests);
            hideLoading();

        } catch (error) {
            console.error('Error fetching client repair requests:', error);
            if (error.response && error.response.status === 401) {
                showError('Authentication failed. Please log in again.');
            } else {
                showError('Failed to load repair requests. Please try again later.');
            }
        }
    };

    // Function to determine device type from description
    const determineDeviceType = (description) => {
        if (!description) return 'Not specified';
        
        const descriptionLower = description.toLowerCase();
        
        // Keywords for mobile devices
        const mobileKeywords = ['phone', 'mobile', 'smartphone', 'iphone', 'samsung', 'huawei', 'xiaomi', 'oppo', 'vivo', 'oneplus', 'nokia', 'motorola', 'sony', 'lg', 'google pixel'];
        
        // Check if any mobile keywords are in the description
        for (const keyword of mobileKeywords) {
            if (descriptionLower.includes(keyword)) {
                return 'Mobile Phone';
            }
        }
        
        // If no mobile keywords found, assume it's a PC
        return 'PC/Laptop';
    };

    // Function to display details of a single request
    const displaySingleRequestDetails = async (requestId) => {
        isViewingDetails = true;
        if (requestsListContainer) {
            requestsListContainer.style.display = 'none';
            requestsListContainer.classList.remove('active');
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.get(`http://127.0.0.1:8000/api/repair-requests/${requestId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const requestData = response.data;
            console.log('Request details:', requestData);

            // Determine device type from description
            const deviceType = determineDeviceType(requestData.description);
            console.log('Determined device type:', deviceType);

            // Update status section to show request details
            if (statusSection) {
                let repairerSection = '';
                if (requestData.repairer_info) {
                    console.log('Creating repairer section with profile:', requestData.repairer_info);
                    repairerSection = `
                        <div class="repairer-section">
                            <h3 class="section-title">Repairer Information</h3>
                            <div class="detail-item">
                                <i class="fas fa-user-tie"></i>
                                <div class="detail-info">
                                    <h3>Name</h3>
                                    <p>${requestData.repairer_info.username || 'Not available'}</p>
                                </div>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-phone"></i>
                                <div class="detail-info">
                                    <h3>Phone Number</h3>
                                    <p>${requestData.repairer_info.phone_number || 'Not available'}</p>
                                </div>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <div class="detail-info">
                                    <h3>Address</h3>
                                    <p>${requestData.repairer_info.address || 'Not available'}</p>
                                </div>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-envelope"></i>
                                <div class="detail-info">
                                    <h3>Email</h3>
                                    <p>${requestData.repairer_info.email || 'Not available'}</p>
                                </div>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-tools"></i>
                                <div class="detail-info">
                                    <h3>Skills</h3>
                                    <p>${requestData.repairer_info.skills || 'Not available'}</p>
                                </div>
                            </div>
                            ${requestData.repairer_info.average_rating ? `
                                <div class="detail-item">
                                    <i class="fas fa-star"></i>
                                    <div class="detail-info">
                                        <h3>Rating</h3>
                                        <p>${requestData.repairer_info.average_rating.toFixed(1)} / 5.0</p>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    `;
                } else {
                    console.log('No repairer info found in request data');
                }

                // Create the HTML content
                const content = `
                    <div class="request-details">
                        <div class="request-header">
                            <h2 style="color: black;">Request Details</h2>
                            <div class="request-status ${requestData.status}">
                                ${requestData.status.charAt(0).toUpperCase() + requestData.status.slice(1)}
                            </div>
                        </div>
                        
                        <div class="request-content">
                            ${requestData.repair_username ? `
                                <div class="detail-item">
                                    <i class="fas fa-user-tie"></i>
                                    <div class="detail-info">
                                        <h3>Repairer</h3>
                                        <p>${requestData.repair_username}</p>
                                    </div>
                                </div>
                            ` : ''}
                            <div class="detail-item">
                             <i class="fas fa-phone"></i>
                                <div class="detail-info">
                                    <h3>repair number</h3>
                                    <p>${  ["05", "06", "07"][Math.floor(Math.random() * 3)] + 
                                        Math.floor(Math.random() * 100000000).toString().padStart(8, '0') || 'No description provided'}</p>
                                </div>
                            </div>

                            <div class="detail-item">
                                <i class="fas ${deviceType === 'Mobile Phone' ? 'fa-mobile-alt' : 'fa-laptop'}"></i>
                                <div class="detail-info">
                                    <h3>Device Type</h3>
                                    <p>${deviceType}</p>
                                </div>
                            </div>

                            <div class="detail-item">
                                <i class="fas fa-info-circle"></i>
                                <div class="detail-info">
                                    <h3>Description</h3>
                                    <p>${requestData.description || 'No description provided'}</p>
                                </div>
                            </div>

                            ${requestData.device_photo ? `
                                <div class="detail-item photo">
                                    <i class="fas fa-camera"></i>
                                    <div class="detail-info">
                                        <h3>Device Photo</h3>
                                        <img src="${requestData.device_photo}" alt="Device Photo" class="device-photo">
                                    </div>
                                </div>
                            ` : ''}

                            ${repairerSection}
                        </div>
                    </div>
                `;

                // Set the HTML content
                statusSection.innerHTML = content;
                
                // Make sure the section is visible
                statusSection.style.display = 'flex';
                statusSection.classList.add('active');

                // Log the final HTML for debugging
                console.log('Final HTML content:', content);
            }

        } catch (error) {
            console.error('Error fetching single repair request:', error);
            if (statusSection) {
                statusSection.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Error loading request details. Please try again later.</p>
                    </div>
                `;
                statusSection.style.display = 'flex';
                statusSection.classList.add('active');
            }
        }
    };

    // Initial fetch of all client repair requests when the page loads
    fetchClientRepairRequests();

    // Poll for status updates periodically
    const pollingInterval = setInterval(() => {
        if (!isViewingDetails) { // Only fetch if not viewing details
            fetchClientRepairRequests();
        }
    }, 10000);

    // Handle back button click
    if (backButton) {
        backButton.addEventListener('click', () => {
            if (statusSection && statusSection.style.display !== 'none') {
                // If viewing details, go back to list
                isViewingDetails = false;
                statusSection.innerHTML = '';
                statusSection.style.display = 'none';
                statusSection.classList.remove('active');
                if (requestsListContainer) {
                    requestsListContainer.style.display = 'flex';
                    requestsListContainer.classList.add('active');
                }
                fetchClientRepairRequests();
            } else {
                // If on list view, go to dashboard
                window.location.href = '../Client Dashboard/h.html';
            }
        });
    }
});