import qs from "qs";
import { attemptSignout } from "components/user";
import { FETCH_TIMEOUT } from "config";
import { push } from "connected-react-router";
import { syncIndexedDB } from "db";

const defaultFetchOptions = {
  method: "GET",
  mode: "same-origin",
  credentials: "same-origin",
  cache: "no-cache",
  redirect: "follow",
  headers: new Headers({
    "content-type": "application/json"
  })
};

export const queryParams = {
  toString: obj => qs.stringify(obj),
  parse: str => qs.parse(str)
};

function isOnline(store) {
  return store.getState().getIn(["application", "online"], false);
}

function fetchStatus({ store, type }, action, loading) {
  store.dispatch({
    type: `${type}_${action}`,
    payload: loading
  });
}

function buildPath(path, options, params) {
  return `${options.baseUrl}/${path}${
    params ? `?${queryParams.toString(params)}` : ""
  }`;
}

async function handleSuccess(store, payload) {
  const { type, json, normalizeFunc, db } = payload;
  const payloadFromDB = await syncIndexedDB(db, json, normalizeFunc);

  store.dispatch({
    type: `${type}_SUCCESS`,
    payload: payloadFromDB
  });
}

function handleSuccessCallback(store, successCallback, response, json) {
  if (successCallback) {
    const isCallbackObject = typeof successCallback === "object";
    const successPayload = isCallbackObject
      ? {
          type: successCallback.action,
          payload: successCallback.payload
        }
      : {
          type: successCallback,
          payload: { response, json }
        };

    store.dispatch(successPayload);

    if (isCallbackObject && successCallback.redirect) {
      store.dispatch(push(successCallback.redirect));
    }
  }
}

function fetchPayload(action, store, options) {
  const controller = new AbortController();

  setTimeout(() => {
    controller.abort();
  }, FETCH_TIMEOUT);

  const {
    type,
    api: { path, body, params, method, normalizeFunc, successCallback, db }
  } = action;

  const fetchOptions = Object.assign({}, defaultFetchOptions, {
    method,
    signal: controller.signal,
    ...(body && { body: JSON.stringify(body) })
  });

  const fetchPath = buildPath(path, options, params);

  const fetch = async () => {
    fetchStatus({ store, type }, "STARTED", true);

    try {
      const response = await window.fetch(fetchPath, fetchOptions);
      const json = await response.json();

      if (!response.ok) {
        fetchStatus({ store, type }, "FAILURE", json);

        if (response.status === 401) {
          store.dispatch(attemptSignout());
        }
      } else {
        await handleSuccess(store, { type, json, normalizeFunc, path, db });
        handleSuccessCallback(store, successCallback, response, json);
      }
      fetchStatus({ store, type }, "FINISHED", false);
    } catch (e) {
      console.warn(e);
      fetchStatus({ store, type }, "FAILURE", false);
    }
  };

  return fetch();
}

const restMiddleware = options => store => next => action => {
  if (!(action.api && "path" in action.api) || !isOnline(store)) {
    return next(action);
  }

  return fetchPayload(action, store, options);
};

export default restMiddleware;
