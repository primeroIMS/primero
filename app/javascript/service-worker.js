if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register('/worker.js', {scope: "/v2/"})
  .then(function(registration) {
    console.log('Registration successful, scope is:', registration.scope);
  }).catch(function(err) {
    console.log('Service worker registration failed, error:', error);
  });
}