// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
import { setTheme } from "./components/application/action-creators";
import { setUserToggleOffline } from "./components/connectivity/action-creators";
import { getAppResources, saveNotificationSubscription } from "./components/user/action-creators";
import { getSubscriptionFromDb } from "./libs/service-worker-utils";
import configureStore from "./store";
import importedTheme from "./libs/load-external-theme";

async function importTheme(dispatch) {
  dispatch(setTheme(importedTheme));
}

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

  importTheme(store.dispatch);
  setFieldModeIfSet(store.dispatch);
  setNotificationSubscription(store.dispatch);
  store.dispatch(getAppResources);

  return { store };
}

export default appInit;
