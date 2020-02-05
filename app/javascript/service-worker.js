if (navigator.serviceWorker) {
  navigator.serviceWorker.register("/worker.js");

  navigator.serviceWorker.ready.then(registration => {
    return registration.sync.register("syncActions");
  });
}
