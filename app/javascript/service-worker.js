export default () => {
  window.addEventListener("load", () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register(`${window.location.origin}/worker.js`)
        .then(registration => {
          console.log("Registration successful, scope is:", registration.scope);
        })
        .catch(error => {
          console.error("Service worker registration failed, error:", error);
        });
    }
  });
};
