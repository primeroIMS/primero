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

export default appInit;
