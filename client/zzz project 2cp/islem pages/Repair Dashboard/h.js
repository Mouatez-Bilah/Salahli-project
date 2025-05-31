        
        document.addEventListener('DOMContentLoaded', function() {

            let repair=JSON.parse(localStorage.getItem("repair"))
            // Button click handlers
            document.getElementById('viewRequests').addEventListener('click', function() {
                location.href="../requests/requests.html"
            });
            
            document.getElementById("myProfile").addEventListener('click', function() {
                location.href="../repair profial/Rprofile.html";
            });
            
            // Logout button handler
            document.querySelector('.logout-btn').addEventListener('click', function() {
                if(confirm('Are you sure you want to log out?')) {
                    localStorage.clear();
                    location.href="../log-in/index.html"
                }
            });
            // // Add username personalization (would normally come from a database)
            // const urlParams = new URLSearchParams(window.location.search);
            // const username = urlParams.get('username') || 'Repair Tech';
            // document.querySelector('.main-title').textContent = `Welcome ${username}`;
            document.getElementById("wc").innerHTML=`<h1 class="main-title" id="wc">Welcome ${repair.username}</h1>`
    
           
         
           
        });

        document.querySelector('.back-button').addEventListener('click', () => {
            window.history.back();
        });

