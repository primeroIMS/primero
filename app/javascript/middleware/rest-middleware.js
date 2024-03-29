// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { ROUTES } from "../config";

import { isOnline, isServerOnline } from "./utils";
import fetchPdfLogos from "./utils/fetch-pdf-logos";
import fetchFromCache from "./utils/fetch-from-cache";
import fetchPayload from "./utils/fetch-payload";

const restMiddleware = options => store => next => action => {
  if (action?.api?.db?.params?.pdfLogoOption) {
    return fetchPdfLogos(action, store, options, next);
  }

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
