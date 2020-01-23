if (navigator.serviceWorker) {
  navigator.serviceWorker
    .register("/worker.js", { scope: "./" })
    .then(function(reg) {
      console.log("[Companion]", "Service worker registered!");
      console.log(reg);
    });
}
