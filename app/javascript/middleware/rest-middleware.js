import { ROUTES } from "../config";

import { isOnline, isServerOnline } from "./utils";
import fetchFromCache from "./utils/fetch-from-cache";
import fetchPayload from "./utils/fetch-payload";

const restMiddleware = options => store => next => action => {
  if (
    !(action.api && (Array.isArray(action.api) || "path" in action.api)) ||
    !isOnline(store) ||
    !isServerOnline(store)
  ) {
    if (action?.api?.path !== ROUTES.check_server_health) {
      return next(action);
    }
  }

  if (action?.api?.db?.alwaysCache) {
    return fetchFromCache(action, store, options, next);
  }

  return fetchPayload(action, store, options);
};

export default restMiddleware;
