import { setUserToggleOffline } from "./components/connectivity/action-creators";
import { getAppResources, saveNotificationSubscription } from "./components/user/action-creators";
import { getSubscriptionFromDb } from "./libs/service-worker-utils";
import configureStore from "./store";

function setFieldModeIfSet(dispatch) {
  if (localStorage.getItem("fieldMode") === "true") {
    dispatch(setUserToggleOffline(true));
  }
}

function setNotificationSubscription(dispatch) {
  getSubscriptionFromDb().then(endpoint => {
    dispatch(saveNotificationSubscription(endpoint));
  });
}

function appInit() {
  const store = configureStore();

  setFieldModeIfSet(store.dispatch);
  setNotificationSubscription(store.dispatch);
  store.dispatch(getAppResources);

  return { store };
}

// This is a workaround for PWA incorrect Height
// Get rid of when this is fixed
// https://bugs.chromium.org/p/chromium/issues/detail?id=1457883
// https://bugs.chromium.org/p/chromium/issues/detail?id=1464146
const documentHeight = () => {
  const doc = document.documentElement;

  if (window.matchMedia("(display-mode: fullscreen)").matches) {
    doc.style.setProperty("--doc-height", `${window.screen.availHeight}px`);
  }
};

window.screen.orientation.addEventListener("change", documentHeight);

documentHeight();

export default appInit;
