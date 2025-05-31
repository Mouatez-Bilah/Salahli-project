document.addEventListener('DOMContentLoaded', function() {
    const repairersContainer = document.querySelector('.repairers-container');
    const loadingSpinner = document.querySelector('.loading-spinner');
    const errorMessage = document.querySelector('.error-message');
    const searchInput = document.getElementById('searchInput');
    const ratingFilter = document.getElementById('ratingFilter');
    const priceFilter = document.getElementById('priceFilter');

    let repairers = [];
    let filteredRepairers = [];

    // Show loading spinner
    loadingSpinner.style.display = 'flex';
    errorMessage.style.display = 'none';

    // Fetch repairers from API
    async function fetchRepairers() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.get('http://127.0.0.1:8000/api/repairs/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            repairers = response.data.results;
            filteredRepairers = [...repairers];
            displayRepairers(filteredRepairers);
        } catch (error) {
            console.error('Error fetching repairers:', error);
            showError();
        } finally {
            loadingSpinner.style.display = 'none';
        }
    }

    // Display repairers in the container
    function displayRepairers(repairersToShow) {
        repairersContainer.innerHTML = '';
        
        repairersToShow.forEach(repairer => {
            const repairerCard = document.createElement('div');
            repairerCard.className = 'repairer-card';
            
            // Generate stars based on rating
            const rating = repairer.repair_profile?.average_rating || 0;
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 >= 0.5;
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
            
            let starsHTML = '';
            for (let i = 0; i < fullStars; i++) {
                starsHTML += '<span class="star">★</span>';
            }
            if (hasHalfStar) {
                starsHTML += '<span class="star half">★</span>';
            }
            for (let i = 0; i < emptyStars; i++) {
                starsHTML += '<span class="star empty">☆</span>';
            }

            repairerCard.innerHTML = `
                <img src="${repairer.repair_profile?.photo || 'https://via.placeholder.com/80'}" 
                     alt="${repairer.username}" 
                     class="repairer-photo">
                <div class="repairer-info">
                    <div class="repairer-name">${repairer.username}</div>
                    <div class="rating">
                        <span class="rating-number">${rating.toFixed(1)}</span>
                        <div class="stars">${starsHTML}</div>
                    </div>
                    <div class="phone-number">${repairer.phone_number || 'No phone number'}</div>
                </div>
                <div class="action-buttons">
                    <button class="profile-btn" onclick="viewProfile(${repairer.id})">Profile</button>
                    <button class="select-btn" onclick="selectRepairer(${repairer.id})">Select</button>
                </div>
            `;
            
            repairersContainer.appendChild(repairerCard);
        });
    }

    // Show error message
    function showError() {
        errorMessage.style.display = 'block';
        repairersContainer.innerHTML = '';
    }

    // Search functionality
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        filteredRepairers = repairers.filter(repairer => 
            repairer.username.toLowerCase().includes(searchTerm) ||
            repairer.phone_number?.toLowerCase().includes(searchTerm)
        );
        displayRepairers(filteredRepairers);
    });

    // Rating filter
    ratingFilter.addEventListener('click', function() {
        filteredRepairers.sort((a, b) => 
            (b.repair_profile?.average_rating || 0) - (a.repair_profile?.average_rating || 0)
        );
        displayRepairers(filteredRepairers);
    });

    // Price filter (placeholder - implement based on your API)
    priceFilter.addEventListener('click', function() {
        // Implement price filtering when available in API
        alert('Price filtering will be available soon');
    });

    // View repairer profile
    window.viewProfile = function(repairerId) {
        localStorage.setItem('selectedRepairerId', repairerId);
        window.location.href = '../repair-profile/repair-profile.html';
    };

    // Select repairer
    window.selectRepairer = function(repairerId) {
        localStorage.setItem('selectedRepairerId', repairerId);
        window.location.href = '../new-request/new-request.html';
    };

    // Initialize
    fetchRepairers();
}); 