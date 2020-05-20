import { METHODS } from "../config";

import { isOnline, retrieveData, queueData } from "./utils";

const offlineMiddleware = store => next => action => {
  if (!action?.api?.path || isOnline(store)) {
    return next(action);
  }

  const {
    api: { method, queueOffline },
    fromQueue
  } = action;
  const apiMethod = method || METHODS.GET;

  if (apiMethod === METHODS.GET) {
    retrieveData(store, action);

    return next(action);
  }

  if (queueOffline && !fromQueue) {
    queueData(store, action);
  }

  return next(action);
};

export default offlineMiddleware;
