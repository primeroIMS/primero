export default () => {
  window.addEventListener("load", () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register(`${window.location.origin}/worker.js`)
        .then(registration => {
          // eslint-disable-next-line no-console
          console.log("Registration successful, scope is:", registration.scope);
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error("Service worker registration failed, error:", error);
        });
    }
  });
};
