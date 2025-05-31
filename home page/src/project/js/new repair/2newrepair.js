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
    
    sendRequestBtn.addEventListener('click', function() {
        const problemDescription = document.getElementById('problemDescription').value;
        
        // Validate form
        if (!problemDescription) {
            alert('Please describe your problem');
            return;
        }
        
        // Here you would typically send the data to your server
        alert('Repair request submitted successfully!');
        
        // Reset form
        document.getElementById('deviceType').selectedIndex = 0;
        document.getElementById('problemDescription').value = '';
        addPhotoBtn.querySelector('span').textContent = 'Add a photo of your device';
        photoInput.value = '';
    });
});