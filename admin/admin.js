document.addEventListener('DOMContentLoaded', function() {
  // Initialize Netlify Identity
  netlifyIdentity.init();

  const loginButton = document.getElementById('loginButton');
  const logoutButton = document.getElementById('logoutButton');
  const adminStatus = document.getElementById('admin-status');
  const adminActions = document.getElementById('admin-actions');

  // Check if the user is logged in
  const user = netlifyIdentity.currentUser();
  if (user) {
      handleLogin(user);
  } else {
      handleLogout();
  }

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
      handleLogin(user);
      netlifyIdentity.close();  // Closes the modal after login
  });

  netlifyIdentity.on('logout', () => {
      handleLogout();
  });

  // Functions to handle login/logout
  function handleLogin(user) {
      console.log('Logged in as:', user);
      adminStatus.textContent = `Hello, ${user.user_metadata.full_name}. You are logged in.`;
      loginButton.style.display = 'none';
      logoutButton.style.display = 'block';
      adminActions.style.display = 'block';
  }

  function handleLogout() {
      console.log('Logged out');
      adminStatus.textContent = 'You are not logged in. Redirecting to home page...';
      loginButton.style.display = 'block';
      logoutButton.style.display = 'none';
      adminActions.style.display = 'none';

      // Redirect to home page after 3 seconds
      setTimeout(() => {
          window.location.href = '/';
      }, 3000);
  }
});
