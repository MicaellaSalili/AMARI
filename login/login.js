// This file contains the JavaScript logic for the login page.
// It handles form submission, validates user input, and manages authentication.

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', handleLogin);
});

function handleLogin(event) {
    event.preventDefault(); // Prevent form submission

    // Get the username and password values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Hardcoded credentials for demonstration purposes
    const validUsername = "admin";
    const validPassword = "password123";

    // Validate credentials
    if (username === validUsername && password === validPassword) {
        // Redirect to the admin page
        window.location.href = "../admin/index.html";
    } else {
        // Show error message
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = "Invalid username or password.";
        errorMessage.style.display = "block";
    }
}