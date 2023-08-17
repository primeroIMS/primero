import { getAppResources, saveNotificationSubscription } from "./components/user";
import { getSubscriptionFromDb } from "./libs/service-worker-utils";
import configureStore from "./store";

function appInit() {
  const store = configureStore();

  getSubscriptionFromDb().then(endpoint => {
    store.dispatch(saveNotificationSubscription(endpoint));
  });

  store.dispatch(getAppResources);

  return { store };
}

export default appInit;
