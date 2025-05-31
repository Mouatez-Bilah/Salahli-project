// Add Axios CDN
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const token = localStorage.getItem('token');
        const requestId = localStorage.getItem('currentRequestId');
        
        if (!token || !requestId) {
            console.error('Missing token or request ID');
            return;
        }

        // Fetch request details from API
        const response = await axios.get(`http://127.0.0.1:8000/api/repair-requests/${requestId}/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const request = response.data;
        
        // Determine device type from description
        const isPC = request.description.toLowerCase().includes('pc') || 
                    request.description.toLowerCase().includes('computer') ||
                    request.description.toLowerCase().includes('laptop');

        document.querySelector(".form-container").innerHTML = `
            <div class="device-selection">
                <div class="device-type-label">selected device ▶</div>
                <div class="device-type selected" id="pc">
                    PC
                    <svg class="device-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                </div>
                <div class="device-type" id="phone">
                    Phone
                    <svg class="device-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                        <line x1="12" y1="18" x2="12" y2="18"></line>
                    </svg>
                </div>
            </div>

            <textarea class="problem-input" placeholder="the problem" readonly>${request.description}</textarea>

            <div class="image-section">
                <div class="image-label">image</div>
                <div class="image-placeholder">
                    <div class="image-icon">
                        <img src="${request.image}" alt="Device image">
                    </div>
                </div>
            </div>
        `;

        // Remove the unselected device type
        if (isPC) {
            document.getElementById("phone").remove();
        } else {
            document.getElementById("pc").remove();
        }

    } catch (error) {
        console.error('Error fetching request details:', error);
        document.querySelector(".form-container").innerHTML = `
            <div class="error-message">
                Failed to load request details. Please try again later.
            </div>
        `;
    }
});

