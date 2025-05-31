document.addEventListener('DOMContentLoaded', function() {
    const requestsContainer = document.querySelector('.requests-container');
    const loadingSpinner = document.querySelector('.loading-spinner');
    const errorMessage = document.querySelector('.error-message');
    const noRequests = document.querySelector('.no-requests');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let requests = [];
    let filteredRequests = [];

    // Show loading spinner
    loadingSpinner.style.display = 'flex';
    errorMessage.style.display = 'none';
    noRequests.style.display = 'none';

    // Fetch repair requests from API
    async function fetchRequests() {
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

            requests = response.data.results;
            filteredRequests = [...requests];
            displayRequests(filteredRequests);
        } catch (error) {
            console.error('Error fetching requests:', error);
            showError();
        } finally {
            loadingSpinner.style.display = 'none';
        }
    }

    // Display requests in the container
    function displayRequests(requestsToShow) {
        requestsContainer.innerHTML = '';
        
        if (requestsToShow.length === 0) {
            noRequests.style.display = 'block';
            return;
        }

        noRequests.style.display = 'none';
        
        requestsToShow.forEach(request => {
            const requestCard = document.createElement('div');
            requestCard.className = 'request-card';
            
            const statusClass = `status-${request.status}`;
            const statusText = request.status.charAt(0).toUpperCase() + request.status.slice(1);
            
            requestCard.innerHTML = `
                <div class="request-header">
                    <div class="repairer-info">
                        <img src="${request.repair?.repair_profile?.photo || 'https://via.placeholder.com/50'}" 
                             alt="${request.repair_username}" 
                             class="repairer-photo">
                        <div class="repairer-name">${request.repair_username}</div>
                    </div>
                    <div class="request-status ${statusClass}">${statusText}</div>
                </div>
                <div class="request-details">
                    <div class="request-description">${request.description}</div>
                    ${request.image ? `<img src="${request.image}" alt="Request image" class="request-image">` : ''}
                    <div class="request-date">Submitted on ${new Date(request.created_at).toLocaleDateString()}</div>
                </div>
            `;
            
            requestsContainer.appendChild(requestCard);
        });
    }

    // Show error message
    function showError() {
        errorMessage.style.display = 'block';
        requestsContainer.innerHTML = '';
        noRequests.style.display = 'none';
    }

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter requests
            const status = this.dataset.status;
            if (status === 'all') {
                filteredRequests = [...requests];
            } else {
                filteredRequests = requests.filter(request => request.status === status);
            }
            displayRequests(filteredRequests);
        });
    });

    // Initialize
    fetchRequests();
}); 