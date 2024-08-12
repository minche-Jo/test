document.getElementById('clickMeButton').addEventListener('click', function() {
  const messageElement = document.getElementById('message');
  messageElement.textContent = "You clicked the button!";
});
// Initialize Netlify Identity
netlifyIdentity.init();

// Get references to buttons and status
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');
const statusElement = document.getElementById('status');

// Login Button Event
loginButton.addEventListener('click', function() {
    netlifyIdentity.open();  // Opens the login/signup modal
});

// Logout Button Event
logoutButton.addEventListener('click', function() {
    netlifyIdentity.logout();  // Logs out the user
});

// Handle login/logout events
netlifyIdentity.on('login', user => {
    console.log('Logged in as:', user);
    statusElement.textContent = `Hello, ${user.user_metadata.full_name}`;
    loginButton.style.display = 'none';
    logoutButton.style.display = 'block';
    netlifyIdentity.close();  // Closes the modal after login
});

netlifyIdentity.on('logout', () => {
    console.log('Logged out');
    statusElement.textContent = 'You are logged out';
    loginButton.style.display = 'block';
    logoutButton.style.display = 'none';
});
