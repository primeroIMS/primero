import { openDB } from "idb";
import some from "lodash/some";
import startsWith from "lodash/startsWith";

const ERROR_STORE_LIMIT = 50;

let handlersRegistered = false;

const store = "errors";

window.console.defaultError = window.console.error.bind(console);

const _db = openDB("error-logger", 1, {
  upgrade(db) {
    db.createObjectStore(store, {
      keyPath: "id",
      autoIncrement: true
    });
  }
});

async function cleanDB() {
  const count = await (await _db).count(store);

  if (count > ERROR_STORE_LIMIT) {
    const tx = (await _db).transaction(store, "readwrite");
    const keys = await tx.store.getAllKeys();

    await Promise.all([keys.splice(0, ERROR_STORE_LIMIT).forEach(index => tx.store.delete(index)), tx.done]);
  }
}

async function log(data = {}) {
  return (await _db).add(store, { ...data, createdAt: new Date() });
}

function errorHandler(message, url, lineNumber, columnNumber, error) {
  log({
    message,
    url,
    lineNumber,
    columnNumber,
    error
  });

  return false;
}

async function rejectionHandler(event) {
  log({
    reason: event?.reason?.message
  });

  return false;
}

function startsWithStrings(line = "", strings = []) {
  return some(strings, testString => startsWith(line, testString));
}

function consoleErrorLogger(args) {
  if (!startsWithStrings(args?.[0], ["Warning:"])) {
    log({
      reason: args
    });
  }
}

async function startErrorListeners() {
  if (!handlersRegistered) {
    cleanDB();
    window.onerror = errorHandler;
    window.addEventListener("unhandledrejection", rejectionHandler);

    window.console.error = function newConsoleErrorFunc(...args) {
      consoleErrorLogger(args);
    };

    handlersRegistered = true;
  }
}

function stopErrorListeners() {
  window.removeEventListener("error", errorHandler);
  window.console.error = window.console.defaultError;
  window.removeEventListener("unhandledrejection", rejectionHandler);
  handlersRegistered = false;
}

const ErrorLogger = {
  log,
  stopErrorListeners,
  startErrorListeners
};

Object.freeze(ErrorLogger);

export default ErrorLogger;
