import qs from "qs";

import { attemptSignout } from "../components/user";
import { FETCH_TIMEOUT } from "../config";
import DB, { syncIndexedDB, queueIndexedDB, METHODS } from "../db";
import { signOut } from "../components/pages/login/idp-selection";

import { handleSuccessCallback, isOnline } from "./utils";

const defaultFetchOptions = {
  method: "GET",
  mode: "same-origin",
  credentials: "same-origin",
  cache: "no-cache",
  redirect: "follow",
  headers: {
    "content-type": "application/json"
  }
};

const queryParams = {
  toString: obj => qs.stringify(obj),
  parse: str => qs.parse(str)
};

function fetchStatus({ store, type }, action, loading) {
  store.dispatch({
    type: `${type}_${action}`,
    payload: loading
  });
}

function buildPath(path, options, params, external) {
  const endpoint = external ? path : `${options.baseUrl}/${path}`;

  return `${endpoint}${params ? `?${queryParams.toString(params)}` : ""}`;
}

async function handleSuccess(store, payload) {
  const { type, json, db, fromQueue } = payload;
  const payloadFromDB = await syncIndexedDB(db, json);

  if (fromQueue) {
    queueIndexedDB.delete(fromQueue);
  }

  store.dispatch({
    type: `${type}_SUCCESS`,
    payload: payloadFromDB
  });
}

const getToken = () => {
  return sessionStorage.getItem("msal.idtoken");
};

function fetchPayload(action, store, options) {
  const controller = new AbortController();

  setTimeout(() => {
    controller.abort();
  }, FETCH_TIMEOUT);

  const {
    type,
    api: {
      path,
      body,
      params,
      method,
      normalizeFunc,
      successCallback,
      failureCallback,
      db,
      external
    },
    fromQueue
  } = action;

  const fetchOptions = {
    ...defaultFetchOptions,
    method,
    signal: controller.signal,
    ...(body && { body: JSON.stringify(body) })
  };

  const token = getToken();

  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  fetchOptions.headers = new Headers(
    Object.assign(fetchOptions.headers, headers)
  );

  const fetchPath = buildPath(path, options, params, external);

  const fetch = async () => {
    fetchStatus({ store, type }, "STARTED", true);

    try {
      const response = await window.fetch(fetchPath, fetchOptions);
      const json = await response.json();

      if (!response.ok) {
        fetchStatus({ store, type }, "FAILURE", json);

        if (response.status === 401) {
          const usingIdp = store
            .getState()
            .getIn(["idp", "use_identity_provider"]);

          store.dispatch(attemptSignout(usingIdp, signOut));
        }
        handleSuccessCallback(store, failureCallback, response, json);
      } else {
        await handleSuccess(store, {
          type,
          json,
          normalizeFunc,
          path,
          db,
          fromQueue
        });
        handleSuccessCallback(
          store,
          successCallback,
          response,
          json,
          fromQueue
        );
      }
      fetchStatus({ store, type }, "FINISHED", false);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e);
      fetchStatus({ store, type }, "FAILURE", false);
      handleSuccessCallback(store, failureCallback, {}, {});
    }
  };

  return fetch();
}

const fetchFromCache = (action, store, options, next) => {
  const {
    type,
    api: { db }
  } = action;

  const fetch = async () => {
    const manifest = await DB.getRecord("manifests", db?.collection);

    if (manifest?.name === db?.manifest) {
      try {
        const payloadFromDB = await syncIndexedDB(db, action, METHODS.READ);

        store.dispatch({
          type: `${type}_SUCCESS`,
          payload: payloadFromDB
        });

        fetchStatus({ store, type }, "FINISHED", false);

        return next(action);
      } catch {
        fetchStatus({ store, type }, "FAILURE", false);
      }
    }

    return fetchPayload(action, store, options);
  };

  return fetch();
};

const restMiddleware = options => store => next => action => {
  if (!(action.api && "path" in action.api) || !isOnline(store)) {
    return next(action);
  }

  if (action?.api?.db?.alwaysCache) {
    return fetchFromCache(action, store, options, next);
  }

  return fetchPayload(action, store, options);
};

export default restMiddleware;
