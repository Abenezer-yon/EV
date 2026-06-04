// --- INITIAL SYSTEM DATA CONFIGURATION ---
var defaultUsername = "Abeny";
var defaultPassword = "1234"; 

// Run setup immediately when DOM content loads to establish session persistence
document.addEventListener('DOMContentLoaded', () => {
    checkSessionState();
    initializeSearchFilter();
});

// --- SESSION MANAGEMENT LOGIC ---
function checkSessionState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const authLink = document.getElementById('auth-nav-link');
    const trackerItem = document.getElementById('tracker-nav-item');

    if (isLoggedIn) {
        if(authLink) authLink.innerHTML = "LOGOUT";
        if(trackerItem) trackerItem.classList.remove('d-none');
        renderTrackerData();
    } else {
        if(authLink) authLink.innerHTML = "LOGIN";
        if(trackerItem) trackerItem.classList.add('d-none');
    }
}

function handleAuthClick() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        // Log Out Action
        localStorage.setItem('isLoggedIn', 'false');
        Swal.fire("Logged Out", "You have been successfully signed out.", "info");
        checkSessionState();
    } else {
        // Launch Log In Window
        loginSample();
    }
}

// --- NEW SIGN UP LOGIC ---
function signUpForm() {
    Swal.fire({
        title: 'Create Account',
        html: `
          <p class="text-muted small">Join EV CARE to track your appointments live.</p>
          <input id="regUsername" type="text" class="swal2-input" placeholder="Choose Username">
          <input id="regPassword" type="password" class="swal2-input" placeholder="Create Password">
        `,
        showCloseButton: true,
        confirmButtonText: 'Register',
        focusConfirm: false,
    }).then((result) => {
        if (result.isConfirmed) {
            var regUser = document.getElementById("regUsername").value.trim();
            var regPass = document.getElementById("regPassword").value.trim();

            if (!regUser || !regPass) {
                Swal.fire("Registration Error", "Fields cannot be blank.", "error").then(() => signUpForm());
                return;
            }

            // Guard rails to prevent overwriting the default profile account configuration
            if (regUser.toLowerCase() === defaultUsername.toLowerCase()) {
                Swal.fire("Username Taken", "This account profile username already exists.", "warning").then(() => signUpForm());
                return;
            }

            // Save new user profile array map parameters inside local infrastructure storage
            let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
            
            // Check if user already exists in custom signups
            if (registeredUsers.some(u => u.user.toLowerCase() === regUser.toLowerCase())) {
                Swal.fire("Username Taken", "This account profile username already exists.", "warning").then(() => signUpForm());
                return;
            }

            registeredUsers.push({ user: regUser, pass: regPass });
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

            Swal.fire({
                icon: "success",
                title: "Registration Complete!",
                text: "Account saved! You can now log in using your new credentials.",
                confirmButtonColor: '#0d6efd'
            }).then(() => {
                loginSample(); // Hand over straight to the login form
            });
        }
    });
}

// --- AUTHENTICATION & CREDENTIAL CHECKERS ---
function loginSample() {
    Swal.fire({
        title: 'Login Form',
        html: `
          <input id="tempUsername" type="text" class="swal2-input" placeholder="Username">
          <input id="tempPassword" type="password" class="swal2-input" placeholder="Password">
          <div class="mt-3 text-center">
            <small class="text-muted">New customer? <a href="#" onclick="Swal.close(); signUpForm(); return false;" class="text-primary fw-bold text-decoration-none">Sign up here</a></small>
          </div>
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
        var InputUsername = document.getElementById("tempUsername").value.trim();
        var InputPassword = document.getElementById("tempPassword").value.trim();
        
        // Pull down alternative user array strings recorded on local disk memory infrastructure
        let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        
        // Validation Layer: Match against default parameters OR structural client signup strings
        var isValidDefault = (defaultUsername === InputUsername && defaultPassword === InputPassword);
        var isValidCustom = registeredUsers.some(u => u.user === InputUsername && u.pass === InputPassword);

        if (isValidDefault || isValidCustom) {
            localStorage.setItem('isLoggedIn', 'true');
            Swal.fire("Logged In", `Welcome back, ${InputUsername}!`, "success");
            checkSessionState();
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Wrong credentials",
            }).then(() => loginSample()); // re-open to ease frustrating form loop resets
        }
    }
}

// --- SEARCH FILTER INTERACTIVITY ---
function initializeSearchFilter() {
    const searchInput = document.getElementById('service-search');
    if(searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            const term = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.service-card');

            cards.forEach(card => {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                card.style.display = title.includes(term) ? "block" : "none";
            });
        });
    }
}

// --- BOOKING TRACKER INTERACTION LOGIC ---
function bookService(serviceName) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        Swal.fire({
            title: "Authentication Required",
            text: "Please log into your account before making service bookings.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Log In / Sign Up",
            confirmButtonColor: '#0d6efd'
        }).then((result) => {
            if (result.isConfirmed) loginSample();
        });
        return;
    }

    Swal.fire({
        title: `Book ${serviceName}`,
        text: "Add a specific note or preferred time for this technician milestone request:",
        input: 'text',
        inputPlaceholder: 'e.g., Saturday morning or Battery indicator showing amber...',
        showCancelButton: true,
        confirmButtonText: 'Confirm Request',
        confirmButtonColor: '#0d6efd'
    }).then((result) => {
        if (result.isConfirmed) {
            const userNote = result.value || "No additional specific scheduling note attached.";
            saveBookingToTracker(serviceName, userNote);
            Swal.fire("Request Logged!", "Appointment saved successfully to your tracker panel.", "success");
        }
    });
}

function saveBookingToTracker(name, note) {
    let currentBookings = JSON.parse(localStorage.getItem('evBookings')) || [];
    
    const newRecord = {
        id: Date.now(),
        service: name,
        details: note,
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        status: "Pending Review"
    };

    currentBookings.push(newRecord);
    localStorage.setItem('evBookings', JSON.stringify(currentBookings));
    renderTrackerData();
}

function renderTrackerData() {
    const container = document.getElementById('tracker-container');
    if (!container) return;

    let currentBookings = JSON.parse(localStorage.getItem('evBookings')) || [];

    if (currentBookings.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted py-5">
                <p class="fs-4">Empty Tracker</p>
                <small>No active repair appointments scheduled yet.</small>
            </div>`;
        return;
    }

    container.innerHTML = currentBookings.map(item => `
        <div class="card bg-secondary text-white mb-3 shadow-sm border-0">
            <div class="card-body p-3">
                <div class="d-flex justify-content-between align-items-start">
                    <h6 class="fw-bold mb-1 text-info">${item.service}</h6>
                    <span class="badge bg-warning text-dark px-2 py-1 small">${item.status}</span>
                </div>
                <p class="card-text text-light small my-2 fst-italic">"${item.details}"</p>
                <div class="d-flex justify-content-between align-items-center mt-2 border-top border-dark pt-2">
                    <small class="text-white-50"><i class="fa fa-clock-o"></i> Today at ${item.timestamp}</small>
                    <button class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removeTrackerItem(${item.id})">Cancel</button>
                </div>
            </div>
        </div>
    `).join('');
}

function removeTrackerItem(id) {
    let currentBookings = JSON.parse(localStorage.getItem('evBookings')) || [];
    currentBookings = currentBookings.filter(item => item.id !== id);
    localStorage.setItem('evBookings', JSON.stringify(currentBookings));
    renderTrackerData();
}