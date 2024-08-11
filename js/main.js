// For demo purposes, Hard coded Username and Password
var username = "Abeny"
var password = "1234" // Password number is in String not int

// Sample Function to test login Ui functionalities
// Used library for toasts and Login form https://sweetalert2.github.io/#examples
function loginSample() {
    Swal.fire({
        //login form Doc: https://sweetalert2.github.io/recipe-gallery/login-form.html  
        title: 'Login Form',
        html: `
          <input id="tempUsername" type="text" id="username" class="swal2-input" placeholder="Username">
          <input id="tempPassword" type="password" id="password" class="swal2-input" placeholder="Password">
        `,
        showCloseButton: true,
        confirmButtonText: 'Sign in',
        // Google sign-in is a cancel Button for proto purposes
        cancelButtonText: `
        <i class="fa fa-google" aria-hidden="true"></i>
      `,
        focusConfirm: false,
    }).then((result) => {
        // Pass results to the credential Checker on the pressed button
        credentialChecker(result);    
    });
}

function credentialChecker(result){
    if (result.isConfirmed) {
        // Id of form can be found on the Custom HTML for SweetAlert
        var InputUsername = document.getElementById("tempUsername").value;
        var InputPassword = document.getElementById("tempPassword").value;
        
        if (username === InputUsername || password === InputPassword) {
            Swal.fire("Logged In", "", "success");
        }else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Wrong password",
            });
        }
    }
}

