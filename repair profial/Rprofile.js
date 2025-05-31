function goBack() {
    location.href = "../Repair Dashboard/h.html";
}

document.addEventListener('DOMContentLoaded', function() {
    try {
        const repair = JSON.parse(localStorage.getItem("repair"));
        if (!repair) {
            throw new Error("No repair profile data found");
        }

        // Calculate rating stars
        const rating = repair.average_rating || 0;
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        // Generate stars HTML
        let starsHTML = '';
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<div class="star filled">★</div>';
        }
        if (hasHalfStar) {
            starsHTML += '<div class="star half">★</div>';
        }
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<div class="star">☆</div>';
        }

        // Update profile info with actual data
        document.querySelector(".profile-name").textContent = repair.username || 'Not Set';
        document.querySelector(".rating-score").textContent = rating.toFixed(1);
        document.querySelector(".stars").innerHTML = starsHTML;

        // Update profile info items
        const infoItems = document.querySelectorAll(".info-item");
        infoItems[0].querySelector(".info-value").textContent = repair.email || 'Not Set';
        infoItems[1].querySelector(".info-value").textContent = repair.phone_number || 'Not Set';
        infoItems[2].querySelector(".info-value").textContent = repair.address || 'Not Set';
        infoItems[3].querySelector(".info-value").textContent = repair.skills || 'Not Set';
        infoItems[4].querySelector(".info-value").textContent = repair.working_hours || '9AM - 6PM';
        infoItems[5].querySelector(".info-value").textContent = repair.repairs_completed || '0';

    } catch (error) {
        console.error("Error loading profile:", error);
        document.querySelector(".profile-card").innerHTML = `
            <div class="error-message">
                <p>Error loading profile data. Please try again later.</p>
                <button onclick="goBack()">Go Back</button>
            </div>
        `;
    }
});

function editProfile() {
    location.href = "../edit profile Repair/Reditprofile.html";
}




