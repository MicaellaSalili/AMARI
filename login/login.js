// This file contains the JavaScript logic for the login page.
// It handles form submission, validates user input, and manages authentication.

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    // Check if user is already authenticated
    checkAuthStatus();

    loginForm.addEventListener('submit', handleLogin);
});

// Check if user is already authenticated
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        
        if (data.authenticated) {
            // User is already logged in, redirect to admin panel
            window.location.href = "/admin";
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
    }
}

async function handleLogin(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    const submitBtn = document.querySelector('.login-btn');

    // Show loading state
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;
    errorMessage.style.display = 'none';

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            // Login successful, redirect to admin panel
            window.location.href = "/admin";
        } else {
            // Show error message
            errorMessage.textContent = data.message || "Invalid username or password.";
            errorMessage.style.display = "block";
        }
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = "Connection error. Please try again.";
        errorMessage.style.display = "block";
    } finally {
        // Reset button state
        submitBtn.textContent = 'Login';
        submitBtn.disabled = false;
    }
}