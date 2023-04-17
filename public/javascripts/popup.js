function openLinkedInAuthPopup(url) {
    const width = 600;
    const height = 600;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);
  
    const popup = window.open(url, 'linkedinAuth', `width=${width},height=${height},top=${top},left=${left}`);
  
    const checkPopupClosed = setInterval(function() {
      if (popup.closed) {
        clearInterval(checkPopupClosed);
        // Check for successful login and reload the main window.
        if (sessionStorage.getItem('loggedIn')) {
          sessionStorage.removeItem('loggedIn');
          window.location.href = '/loggedin';
        }
      }
    }, 100);
  }
  