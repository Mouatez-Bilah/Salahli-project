document.addEventListener('DOMContentLoaded', () => {
    const chooseRepairerBtn = document.querySelector('.choose-repairer-btn');
    const sendRequestBtn = document.querySelector('.send-request-btn');
    const backBtn = document.querySelector('.back-btn');
    const selectedRepairerInfoDiv = document.querySelector('.selected-repairer-info');
    const selectedRepairerName = selectedRepairerInfoDiv ? selectedRepairerInfoDiv.querySelector('.repairer-name') : null;
    const selectedRepairerRating = selectedRepairerInfoDiv ? selectedRepairerInfoDiv.querySelector('.repairer-rating') : null;
    const selectedRepairerPhone = selectedRepairerInfoDiv ? selectedRepairerInfoDiv.querySelector('.repairer-phone') : null;
    const cancelSelectionBtn = selectedRepairerInfoDiv ? selectedRepairerInfoDiv.querySelector('.cancel-selection-btn') : null;
    const photoUpload = document.getElementById('photo-upload');
    const fileUploadLabel = document.querySelector('.file-upload-label');

    // Function to store photo data
    function storePhotoData(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            localStorage.setItem('photoPreview', e.target.result);
            localStorage.setItem('photoName', file.name);
        };
        reader.readAsDataURL(file);
    }

    // Function to restore photo preview
    function restorePhotoPreview() {
        const photoPreview = localStorage.getItem('photoPreview');
        const photoName = localStorage.getItem('photoName');
        if (photoPreview && photoName) {
            fileUploadLabel.innerHTML = `
                <div class="preview-container">
                    <img src="${photoPreview}" alt="Preview" class="image-preview">
                    <div class="file-info">
                        <span class="file-name">${photoName}</span>
                        <button type="button" class="remove-file">×</button>
                    </div>
                </div>
            `;
            fileUploadLabel.classList.add('file-selected');
        }
    }

    // Handle photo upload change
    if (photoUpload && fileUploadLabel) {
        photoUpload.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                storePhotoData(file);
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    fileUploadLabel.innerHTML = `
                        <div class="preview-container">
                            <img src="${e.target.result}" alt="Preview" class="image-preview">
                            <div class="file-info">
                                <span class="file-name">${file.name}</span>
                                <button type="button" class="remove-file">×</button>
                            </div>
                        </div>
                    `;
                    fileUploadLabel.classList.add('file-selected');
                };
                
                reader.readAsDataURL(file);
            }
        });

        // Handle remove file button
        fileUploadLabel.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-file')) {
                e.preventDefault();
                e.stopPropagation();
                photoUpload.value = '';
                localStorage.removeItem('photoPreview');
                localStorage.removeItem('photoName');
                fileUploadLabel.innerHTML = `
                    Add a photo of your device
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M15 12l-3 3l-3-3"></path>
                        <path d="M12 15v6"></path>
                        <path d="M17 18a5 5 0 0 0 5-5c0-1.2-.3-2.3-.8-3.3c-1.4-3-4.5-5-8.2-5C9.2 4.7 6.1 6.7 4.7 9.7c-.5 1-.8 2.1-.8 3.3a5 5 0 0 0 5 5h1"></path>
                    </svg>
                `;
                fileUploadLabel.classList.remove('file-selected');
            }
        });
    }

    // Restore photo preview on page load
    restorePhotoPreview();

    // Function to fetch repairer details by ID
    const fetchRepairerDetails = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return null;
            }

            const response = await axios.get(`http://127.0.0.1:8000/api/users/${userId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return response.data.repair_profile;

        } catch (error) {
            console.error('Error fetching repairer details:', error);
            return null;
        }
    };

    // Function to display selected repairer details
    const displaySelectedRepairer = (repairerProfile) => {
        if (selectedRepairerInfoDiv && repairerProfile) {
            selectedRepairerName.textContent = repairerProfile.username;
            let starsHtml = '';
            const rating = repairerProfile.average_rating || 0;
            for (let i = 0; i < 5; i++) {
                starsHtml += `<svg class="icon star-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="fill: ${i < rating ? '#ffc107' : 'none'}; stroke: #ffc107;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
            }
            selectedRepairerRating.innerHTML = `${rating.toFixed(1)} ${starsHtml}`;
            selectedRepairerPhone.textContent = repairerProfile.phone_number || 'No phone number';
            
            selectedRepairerInfoDiv.style.display = 'flex';
            if(chooseRepairerBtn) {
                chooseRepairerBtn.style.display = 'none';
            }
        }
    };

    // Check for selected repairer data on page load
    const selectedRepairerProfileString = localStorage.getItem('selectedRepairerProfile');
    const selectedRepairerUserId = localStorage.getItem('selectedRepairerUserId');

    if (selectedRepairerProfileString && selectedRepairerUserId) {
        try {
            const repairerProfile = JSON.parse(selectedRepairerProfileString);
            if (repairerProfile && repairerProfile.username && repairerProfile.average_rating !== undefined && repairerProfile.phone_number !== undefined) {
                displaySelectedRepairer(repairerProfile);
            } else {
                localStorage.removeItem('selectedRepairerProfile');
                localStorage.removeItem('selectedRepairerUserId');
            }
        } catch (e) {
            console.error('Error parsing selected repairer profile from local storage:', e);
            localStorage.removeItem('selectedRepairerProfile');
            localStorage.removeItem('selectedRepairerUserId');
        }
    } else {
        if(chooseRepairerBtn) chooseRepairerBtn.style.display = 'flex';
        if(selectedRepairerInfoDiv) selectedRepairerInfoDiv.style.display = 'none';
        if (!selectedRepairerProfileString && selectedRepairerUserId) {
            localStorage.removeItem('selectedRepairerUserId');
        }
    }

    // Event listener for the Cancel Selection button
    if (cancelSelectionBtn) {
        cancelSelectionBtn.addEventListener('click', () => {
            localStorage.removeItem('selectedRepairerProfile');
            localStorage.removeItem('selectedRepairerUserId');

            if (selectedRepairerInfoDiv) {
                selectedRepairerInfoDiv.style.display = 'none';
            }

            if (chooseRepairerBtn) {
                chooseRepairerBtn.style.display = 'flex';
            }
        });
    }

    // Navigate to the repair list page when 'Choose one repairer' is clicked
    if (chooseRepairerBtn) {
        chooseRepairerBtn.addEventListener('click', () => {
            localStorage.removeItem('selectedRepairerProfile');
            localStorage.removeItem('selectedRepairerUserId');
            window.location.href = '../repair list/repair-list.html';
        });
    }

    // Custom alert function
    function showCustomAlert(message, type = 'success') {
        const alert = document.getElementById('customAlert');
        const alertMessage = document.getElementById('alertMessage');
        const alertButton = document.getElementById('alertButton');
        const overlay = document.getElementById('overlay');

        alertMessage.textContent = message;
        alert.className = `custom-alert ${type}`;
        alert.style.display = 'block';
        overlay.style.display = 'block';

        alertButton.onclick = function() {
            alert.style.display = 'none';
            overlay.style.display = 'none';
            if (type === 'success') {
                // Clear localStorage only after storing the profile
                const repairerProfile = JSON.parse(localStorage.getItem('selectedRepairerProfile') || '{}');
                const requestId = localStorage.getItem('lastRequestId');
                if (repairerProfile && requestId) {
                    localStorage.setItem(`repairer_profile_${requestId}`, JSON.stringify(repairerProfile));
                }
                // Now clear the original profile
                localStorage.removeItem('selectedRepairerProfile');
                localStorage.removeItem('selectedRepairerUserId');
                localStorage.removeItem('lastRequestId');
                // Then redirect
                window.location.replace('../Client Dashboard/h.html');
            }
        };
    }

    // Handle sending the repair request
    if (sendRequestBtn) {
        sendRequestBtn.addEventListener('click', async () => {
            try {
                const deviceType = document.querySelector('.form-input').value;
                const problemDescription = document.querySelector('.form-textarea').value;
                const photoFile = document.getElementById('photo-upload').files[0];
                const chosenRepairerUserId = localStorage.getItem('selectedRepairerUserId');

                // Validation checks
                if (!chosenRepairerUserId) {
                    showCustomAlert('Please select a repairer first.', 'error');
                    return;
                }

                if (!problemDescription.trim()) {
                    showCustomAlert('Please describe your problem.', 'error');
                    return;
                }

                if (!deviceType) {
                    showCustomAlert('Please select a device type.', 'error');
                    return;
                }

                if (!photoFile) {
                    showCustomAlert('Please add a photo of your device.', 'error');
                    return;
                }

                // Create FormData object
                const formData = new FormData();
                formData.append('repair', chosenRepairerUserId);
                formData.append('description', problemDescription.trim());
                formData.append('device_type', deviceType);
                formData.append('image', photoFile);

                // Get token
                const token = localStorage.getItem('token');
                if (!token) {
                    showCustomAlert('Authentication failed. Please log in again.', 'error');
                    return;
                }

                // Make the request
                const response = await axios.post('http://127.0.0.1:8000/api/repair-requests/', formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                // Store the request ID for later use
                console.log('Storing request ID:', response.data.id);
                localStorage.setItem('lastRequestId', response.data.id);

                // Get the repairer profile
                const repairerProfile = JSON.parse(localStorage.getItem('selectedRepairerProfile') || '{}');
                console.log('Repairer profile before storing:', repairerProfile);

                // Store the repairer profile with the request ID
                if (repairerProfile && response.data.id) {
                    console.log('Storing repairer profile with key:', `repairer_profile_${response.data.id}`);
                    localStorage.setItem(`repairer_profile_${response.data.id}`, JSON.stringify(repairerProfile));
                }

                // Clear form fields and localStorage
                document.querySelector('.form-input').value = '';
                document.querySelector('.form-textarea').value = '';
                document.getElementById('photo-upload').value = '';
                localStorage.removeItem('photoPreview');
                localStorage.removeItem('photoName');
                
                // Show success message
                showCustomAlert('Repair request sent successfully!');

            } catch (error) {
                console.error('Error details:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
                
                // Show error message
                const errorMessage = error.response?.data?.detail || 
                                   error.response?.data?.message || 
                                   error.message;
                showCustomAlert(`Failed to send repair request: ${errorMessage}`, 'error');
            }
        });
    }

    // Handle back button click
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            // Don't remove photo data when going back
            localStorage.removeItem('selectedRepairerProfile');
            localStorage.removeItem('selectedRepairerUserId');
            localStorage.removeItem('photoPreview');
            localStorage.removeItem('photoName');
            window.history.back();
        });
    }
}); 