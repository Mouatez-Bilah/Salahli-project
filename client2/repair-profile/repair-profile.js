document.addEventListener('DOMContentLoaded', () => {
    const profilePicture = document.getElementById('profile-picture');
    const repairerName = document.getElementById('repairer-name');
    const ratingStars = document.getElementById('rating-stars');
    const averageRating = document.getElementById('average-rating');
    const phoneNumber = document.getElementById('phone-number');
    const email = document.getElementById('email');
    const address = document.getElementById('address');
    const skills = document.getElementById('skills');

    // Get the repairer data from localStorage
    const repairerData = JSON.parse(localStorage.getItem('selectedRepairerProfile'));

    if (!repairerData) {
        alert('No repairer profile selected');
        window.location.href = '../repair list/repair-list.html';
        return;
    }

    // Function to create star icons
    const createStars = (rating) => {
        let starsHtml = '';
        for (let i = 0; i < 5; i++) {
            starsHtml += `<div class="star" style="color: ${i < rating ? '#ffc107' : '#e4e5e9'}">★</div>`;
        }
        return starsHtml;
    };

    // Set profile information
    repairerName.textContent = repairerData.username || 'Not Set';
    phoneNumber.textContent = repairerData.phone_number || 'Not Set';
    email.textContent = repairerData.email || 'Not Set';
    address.textContent = repairerData.address || 'Not Set';

    // Set rating
    const rating = repairerData.average_rating || 0;
    ratingStars.innerHTML = createStars(Math.round(rating));
    averageRating.textContent = rating.toFixed(1);

    // Set skills
    const skillsList = repairerData.skills?.split(',') || [];
    const customSkills = repairerData.custom_skills?.split(',') || [];
    const allSkills = [...skillsList, ...customSkills]
        .filter(skill => skill && skill !== 'null')
        .map(skill => skill.trim())
        .join(', ');
    
    skills.textContent = allSkills || 'Not Set';

    // Set profile picture if available
    if (repairerData.profile_picture) {
        profilePicture.src = repairerData.profile_picture;
    }

    // Handle back button click
    window.goBack = () => {
        window.history.back();
    };
}); 