document.addEventListener('DOMContentLoaded', function() {
    // Handle photo upload button
    const addPhotoBtn = document.getElementById('addPhoto');
    const photoInput = document.getElementById('photoInput');
    
    addPhotoBtn.addEventListener('click', function() {
        photoInput.click();
    });
    
    photoInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            addPhotoBtn.querySelector('span').textContent = this.files[0].name;
        }
    });
    
    // Handle form submission
    const sendRequestBtn = document.getElementById('sendRequest');
    
    sendRequestBtn.addEventListener('click', async function() {
        const deviceType = document.getElementById('deviceType').value;
        const problemDescription = document.getElementById('problemDescription').value;
        const repairer = document.getElementById('repairer').value;
        
        // Validate form
        if (!deviceType || !problemDescription || !repairer) {
            alert('Please fill out all required fields');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Create FormData object to handle file upload
            const formData = new FormData();
            formData.append('device_type', deviceType);
            formData.append('description', problemDescription);
            formData.append('repairer', repairer);
            formData.append('status', 'pending');
            if (photoInput.files[0]) {
                formData.append('image', photoInput.files[0]);
            }

            // Send request to server
            const response = await axios.post('http://127.0.0.1:8000/api/repair-requests/', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data && response.data.id) {
                // Store the request ID in localStorage
                localStorage.setItem('latestRepairRequestId', response.data.id);
                
                alert('Repair request submitted successfully!');
                
                window.location.href = '../client dashboard/h.html';
                // Redirect to tracker page
            } else {
                throw new Error('Invalid response from server');
            }
            
        } catch (error) {
            console.error('Error submitting repair request:', error);
            if (error.response && error.response.data) {
                console.error('Error details:', error.response.data);
                alert(`Error: ${error.response.data.error || 'Failed to submit repair request'}`);
            } else {
                alert('Error submitting repair request. Please try again.');
            }
        }
    });
});