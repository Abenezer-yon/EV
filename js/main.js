// --- EXISTING LOGIN LOGIC ---
var username = "Abeny"
var password = "1234" 

function loginSample() {
    Swal.fire({
        title: 'Login Form',
        html: `
          <input id="tempUsername" type="text" class="swal2-input" placeholder="Username">
          <input id="tempPassword" type="password" class="swal2-input" placeholder="Password">
        `,
        showCloseButton: true,
        confirmButtonText: 'Sign in',
        cancelButtonText: '<i class="fa fa-google" aria-hidden="true"></i>',
        focusConfirm: false,
    }).then((result) => {
        credentialChecker(result);    
    });
}

function credentialChecker(result){
    if (result.isConfirmed) {
        var InputUsername = document.getElementById("tempUsername").value;
        var InputPassword = document.getElementById("tempPassword").value;
        
        if (username === InputUsername && password === InputPassword) {
            Swal.fire("Logged In", `Welcome back, ${username}!`, "success");
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Wrong credentials",
            });
        }
    }
}

// --- NEW SEARCH FILTER LOGIC ---
// This runs every time you type in the search bar
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('service-search');
    if(searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            const term = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.service-card'); // Make sure your HTML columns have this class

            cards.forEach(card => {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                // Show/Hide Bootstrap columns
                card.style.display = title.includes(term) ? "block" : "none";
            });
        });
    }
});

// --- NEW BOOKING LOGIC ---
function bookService(serviceName) {
    Swal.fire({
        title: `Book ${serviceName}`,
        text: "Would you like to request an appointment for this EV service?",
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Request Appointment',
        confirmButtonColor: '#0d6efd'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire("Request Sent!", "An EV technician will contact you shortly.", "success");
        }
    });
}