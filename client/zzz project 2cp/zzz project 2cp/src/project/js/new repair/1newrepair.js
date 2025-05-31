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
        const deviceType = document.getElementById('deviceType').value;
        const problemDescription = document.getElementById('problemDescription').value;
        const repairer = document.getElementById('repairer').value;
        
        // Validate form
        if (!deviceType || !problemDescription || !repairer) {
            alert('Please fill out all required fields');
            return;
        }
        
        // Here you would typically send the data to your server
        alert('Repair request submitted successfully!');
        
        // Reset form
        document.getElementById('deviceType').selectedIndex = 0;
        document.getElementById('problemDescription').value = '';
        document.getElementById('repairer').selectedIndex = 0;
        addPhotoBtn.querySelector('span').textContent = 'Add a photo of your device';
        photoInput.value = '';
    });
});