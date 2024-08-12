document.addEventListener('DOMContentLoaded', function() {
  // Initialize Netlify Identity
  netlifyIdentity.init();

  const loginButton = document.getElementById('loginButton');
  const logoutButton = document.getElementById('logoutButton');
  const adminStatus = document.getElementById('admin-status');
  const adminActions = document.getElementById('admin-actions');

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
      adminStatus.textContent = `Hello, ${user.user_metadata.full_name}. You are logged in.`;
      loginButton.style.display = 'none';
      logoutButton.style.display = 'block';
      adminActions.style.display = 'block';
      netlifyIdentity.close();  // Closes the modal after login
  });

  netlifyIdentity.on('logout', () => {
      console.log('Logged out');
      adminStatus.textContent = 'You are not logged in.';
      loginButton.style.display = 'block';
      logoutButton.style.display = 'none';
      adminActions.style.display = 'none';
  });

  // Example of an admin action
  const actionButton = document.getElementById('actionButton');
  actionButton.addEventListener('click', function() {
      alert('Admin action performed!');
  });
});
