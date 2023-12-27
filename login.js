const passwordInput = document.getElementById('password');
const showPasswordCheckbox = document.getElementById('showPassword');
const errorDisplay = document.getElementById('errorDisplay');

// Function to remove the red border
function removeErrorBorder() {
    passwordInput.classList.remove('error-border');
}

showPasswordCheckbox.addEventListener('change', function () {
    if (showPasswordCheckbox.checked) {
        passwordInput.type = 'text'; // Change the input type to text to show the password
    } else {
        passwordInput.type = 'password'; // Change it back to a password field
    }
});

document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting

    // Get the values entered by the user
      removeErrorBorder();

    const enteredUsername = document.getElementById('username').value;
    const enteredPassword = document.getElementById('password').value;

    // Define the URL to which you want to send the POST request
    const url = 'http://14.225.254.74:1338/api/auth/local'

    // Define the data you want to send as the request body (usually in JSON format)
    const data = {
        "identifier": enteredUsername,
        "password": enteredPassword
    };

    // Create an object to configure the request
    const requestOptions = {
        method: 'POST', // Specify the HTTP method
        headers: {
            'Content-Type': 'application/json' // Set the content type to JSON
        },
        body: JSON.stringify(data) // Convert the data to a JSON string
    };

    // Make the POST request using fetch
    fetch(url, requestOptions)
        .then(async (res) => {
            const data = await res.json();
            if (res.ok) {
                console.log("goi request thanh cong!");
                console.log(data?.jwt);
                localStorage.setItem('jwt', data.jwt);
                window.location.href = "/history.html";
            }
            else {
                console.log("goi request that bai!");
                console.log(data);
                passwordInput.classList.add('error-border');
                errorDisplay.textContent = "Tên tài khoản hoặc mật khẩu sai. Hãy nhập lại.";
                errorDisplay.style.display = "block"; // Show the error message
            }
        })
});