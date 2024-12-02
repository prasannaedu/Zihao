// Handle the login form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send login request to the backend
    fetch('/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.access) {
            // Store the access token in localStorage or sessionStorage
            localStorage.setItem('access_token', data.access);

            // Redirect to /recipes/ page
            window.location.href = '/recipes/';
        } else {
            // Display error message if credentials are invalid
            alert(data.error || 'Login failed');
        }
    })
    .catch(error => console.error('Error:', error));
});
