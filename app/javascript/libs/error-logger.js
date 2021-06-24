import { openDB } from "idb";

let handlersRegistered = false;

const store = "errors";

const _db = openDB("error-logger", 1, {
  upgrade(db) {
    db.createObjectStore(store, {
      keyPath: "id",
      autoIncrement: true
    });
  }
});

async function log(data = {}) {
  return (await _db).add(store, data);
}

function errorHandler(message, url, lineNumber, columnNumber, error) {
  log({
    message,
    url,
    lineNumber,
    columnNumber,
    error: JSON.stringify(error),
    createdAt: new Date()
  });

  return false;
}

async function rejectionHandler(event) {
  log({
    reason: event?.reason?.message,
    createdAt: new Date()
  });

  return false;
}

async function startErrorListeners() {
  if (!handlersRegistered) {
    window.onerror = errorHandler;
    window.addEventListener("unhandledrejection", rejectionHandler);

    handlersRegistered = true;
  }
}

function stopErrorListeners() {
  window.removeEventListener("error", errorHandler);
  // window.removeEventListener("unhandledrejection", rejectionHandler);
  handlersRegistered = false;
}

const ErrorLogger = {
  log,
  stopErrorListeners,
  startErrorListeners
};

Object.freeze(ErrorLogger);

export default ErrorLogger;
