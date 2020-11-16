import { getServerStatus } from "../components/connectivity/action-creators";
import { METHODS } from "../config";

import { isOnline, isServerOnline, retrieveData, queueData, queueFetch } from "./utils";

const offlineMiddleware = store => next => action => {
  const online = isOnline(store);
  const serverOnline = isServerOnline(store);

  if (!action?.api?.path || (online && serverOnline)) {
    return next(action);
  }

  if (!serverOnline && online) {
    store.dispatch(getServerStatus());
  }

  const {
    api: { method, queueOffline, skipDB },
    fromQueue
  } = action;
  const apiMethod = method || METHODS.GET;

  if (apiMethod === METHODS.GET) {
    if (!skipDB) {
      retrieveData(store, action);
    }
    if (queueOffline && !fromQueue) {
      queueFetch(action);
    }

    return next(action);
  }

  if (queueOffline && !fromQueue) {
    queueData(store, action);
  }

  return next(action);
};

export default offlineMiddleware;
