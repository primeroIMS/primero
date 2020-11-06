import { getServerStatus } from "../components/connectivity/action-creators";
import { QUEUE_FETCH } from "../libs/queue";
import EventManager from "../libs/messenger";
import { METHODS } from "../config";

import { isOnline, isServerOnline, retrieveData, queueData } from "./utils";

const offlineMiddleware = store => next => action => {
  const online = isOnline(store);
  const serverOnline = isServerOnline(store);
  const queueFetch = fetchAction => {
    EventManager.publish(QUEUE_FETCH, fetchAction);
  };

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

  if (apiMethod === METHODS.GET && !skipDB) {
    retrieveData(store, action);
    if (queueOffline) {
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
