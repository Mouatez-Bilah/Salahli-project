document.addEventListener('DOMContentLoaded', () => {
    const repairersContainer = document.querySelector('.repairers-list-container');
    const loadingSpinner = document.querySelector('.loading-spinner');
    const errorMessage = document.querySelector('.error-message');
    const backBtn = document.querySelector('.back-btn');
    const rateFilterBtn = document.querySelector('.rate-filter-btn');

    let allRepairers = []; // To store the full list of repairers
    let sortByRateAsc = false; // State for sorting by rate

    // Function to show loading spinner
    const showLoading = () => {
        loadingSpinner.style.display = 'block';
        repairersContainer.innerHTML = '';
        errorMessage.style.display = 'none';
    };

    // Function to hide loading spinner
    const hideLoading = () => {
        loadingSpinner.style.display = 'none';
    };

    // Function to show error message
    const showError = (message) => {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        hideLoading();
        repairersContainer.innerHTML = '';
    };

    // Function to display repairers
    const displayRepairers = (repairers) => {
        repairersContainer.innerHTML = '';
        if (repairers.length === 0) {
            repairersContainer.innerHTML = '<p style="text-align: center;">No repairers found.</p>';
            return;
        }

        repairers.forEach(repairer => {
            // Accessing nested properties from repair_profile
            const repairerProfile = repairer.repair_profile; // Get the nested repair_profile object

            if (!repairerProfile) { // Skip if no repair_profile (e.g., client user)
                return;
            }

            const card = document.createElement('div');
            card.classList.add('repairer-card');
            card.dataset.repairerId = repairer.id; // Use user ID

            const photoDiv = document.createElement('div');
            photoDiv.classList.add('repairer-photo');
            
            // Add the specified image
            const imgElement = document.createElement('img');
            imgElement.src = '../images/vecteezy_a-man-in-a-red-hat-and-overalls-is-standing-in-front-of-a_54977362.jpg';
            imgElement.alt = 'Repairer Photo'; // Added alt text for accessibility
            photoDiv.appendChild(imgElement);

            const infoDiv = document.createElement('div');
            infoDiv.classList.add('repairer-info');

            const name = document.createElement('div');
            name.classList.add('repairer-name');
            name.textContent = repairerProfile.username; // Use username from repair_profile

            const ratingDiv = document.createElement('div');
            ratingDiv.classList.add('repairer-rating');
            const rating = repairerProfile.average_rating || 0; // Use average_rating from repair_profile
            for (let i = 0; i < 5; i++) {
                const star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                star.classList.add('star-icon');
                star.setAttribute('viewBox', '0 0 24 24');
                star.innerHTML = '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>';
                if (i < rating) {
                    star.style.fill = '#ffc107'; // Filled star color
                } else {
                     star.style.fill = 'none'; // Empty star (outline only)
                     star.style.stroke = '#ffc107'; // Outline color
                }
                 star.style.strokeWidth = '2';
                ratingDiv.appendChild(star);
            }

            const phone = document.createElement('div');
            phone.classList.add('repairer-phone');
            phone.textContent = repairerProfile.phone_number || 'No phone number'; // Use phone_number from repair_profile

            infoDiv.appendChild(name);
            infoDiv.appendChild(ratingDiv);
            infoDiv.appendChild(phone);

            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('repairer-actions');

            const profileBtn = document.createElement('button');
            profileBtn.classList.add('profile-btn');
            profileBtn.textContent = 'Profile';
            profileBtn.addEventListener('click', () => {
                // Store the repairer data in localStorage
                localStorage.setItem('selectedRepairerUserId', repairer.id);
                localStorage.setItem('selectedRepairerProfile', JSON.stringify(repairer.repair_profile));
                if (repairer.repair_profile.id !== undefined) {
                    localStorage.setItem('selectedRepairerProfileId', repairer.repair_profile.id);
                }
                // Navigate to the repair profile page
                window.location.href = '../repair-profile/repair-profile.html';
            });

            const selectBtn = document.createElement('button');
            selectBtn.classList.add('select-btn');
            selectBtn.textContent = 'select';
            selectBtn.addEventListener('click', () => {
                // Store selected repairer user ID and profile data and navigate back
                console.log('Selected repairer user ID:', repairer.id);
                localStorage.setItem('selectedRepairerUserId', repairer.id); // Store user ID
                
                // Store the repair_profile object and profile ID
                if (repairer.repair_profile) {
                    console.log('Storing repairer profile:', repairer.repair_profile);
                    localStorage.setItem('selectedRepairerProfile', JSON.stringify(repairer.repair_profile));
                    // Store the Repair Profile ID separately
                    if (repairer.repair_profile.id !== undefined) {
                        localStorage.setItem('selectedRepairerProfileId', repairer.repair_profile.id);
                    }
                }

                window.history.back(); // Navigate back to new repair request page
            });

            actionsDiv.appendChild(profileBtn);
            actionsDiv.appendChild(selectBtn);

            card.appendChild(photoDiv);
            card.appendChild(infoDiv);
            card.appendChild(actionsDiv);

            repairersContainer.appendChild(card);
        });
    };

    // Function to fetch repairers from API
    const fetchRepairers = async () => {
        showLoading();
        try {
            // TODO: Replace with your actual API endpoint if different
            const token = localStorage.getItem('token'); // Get token from local storage
            if (!token) {
                console.error('No token found');
                showError('Authentication failed. Please log in again.');
                return;
            }

            const response = await axios.get('http://127.0.0.1:8000/api/repairs/', { // Updated API endpoint
                headers: {
                    'Authorization': `Bearer ${token}` // Add token to Authorization header
                }
            });

            // Assuming repairers data is in response.data.results, similar to repair requests
            allRepairers = response.data.results; 
            displayRepairers(allRepairers);
            hideLoading();
        } catch (error) {
            console.error('Error fetching repairers:', error);
            // Check for specific error types if needed (e.g., 401 Unauthorized)
            if (error.response && error.response.status === 401) {
                 showError('Authentication failed. Please log in again.');
            } else {
                showError('Failed to load repairers. Please try again later.');
            }
        }
    };

    // Function to sort repairers by rate
    const sortRepairersByRate = () => {
        if (sortByRateAsc) {
            allRepairers.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        } else {
            allRepairers.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }
        sortByRateAsc = !sortByRateAsc; // Toggle sort order
        displayRepairers(allRepairers);
    };

    // Event listener for sorting by rate button
    if (rateFilterBtn) {
        rateFilterBtn.addEventListener('click', sortRepairersByRate);
    }

    // Event listener for back button
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            // TODO: Implement actual navigation back to the new repair request page
            console.log('Back button clicked from repair list');
            window.history.back(); // Example navigation back
        });
    }

    // Initial fetch of repairers when the page loads
    fetchRepairers();
}); 