function goBack() {
    location.href = "../Repair Dashboard/h.html";
}

document.addEventListener('DOMContentLoaded', function() {

    let repair = JSON.parse(localStorage.getItem("repair"))
    document.querySelector(".profile-card").innerHTML=`
    
    
    <div >
                <img class="profile-picture" src="https://s3-alpha-sig.figma.com/img/cd8f/0063/ed12650a498d705e4d4842edbf7066f4?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=HeSYovh4CFfWGj7nWLphEnu3i3H2EeqgetRRsYnbbCzDZvjb9RxiaXPGseptazQjXajuLWL777lBU-BcwN4jivPTMRTXGGLELn5JilfyZEYzW3kv6~WR~DhA4kzE8k3ZjWV-fiee0C-dKwo5NfiUdeOgTS-5wSWUPCUIUskTYyG8jrRXlq8XXg8p6SJm1gubjIEjEfqWn5Q6KlweNAG8DE6bJtNZHWbZM8wAc4m6V9z9U7Em9daYIcV46JJlIPJDT9BZuAO0dyTLFKK5Evin9zmwBOwqYV3ivhhT4I~B38ySnXBArJOz3DqG2x8LxggK1hoLvehglUE0NnAMcLtFVg__" alt="">

    </div>
            
    <div class="profile-name">${repair.username}</div>
    
    <div class="rating">
        <div class="rating-score">5.0</div>
        <div class="stars">
            <div class="star">★</div>
            <div class="star">★</div>
            <div class="star">★</div>
            <div class="star">★</div>
            <div class="star">★</div>
        </div>
    </div>
    
    <div class="profile-info">
        <div class="info-item">email : ${repair.email}</div>
        <div class="info-item"> phone number : ${repair.phonenumber}</div>
        <div class="info-item">Adresse : ${repair.address}</div>
        <div class="info-item"> skills : ${repair.skills}</div>
        <div class="info-item">Working Hours : 9AM - 6PM</div>
        <div class="info-item">Nombre of repair with SALAHLI : 15</div>
    </div>
    
    <button class="edit-button" onclick="editProfile()">
        Edit profile
        <span class="edit-icon">✎</span>
    </button>


    
    
    `
    })
function editProfile() {
    location.href = "../edit profile Repair/Reditprofile.html";
}




