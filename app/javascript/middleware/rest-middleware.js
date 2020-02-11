import { push } from "connected-react-router";
import qs from "qs";

import { attemptSignout } from "../components/user";
import { FETCH_TIMEOUT } from "../config";
import { syncIndexedDB } from "../db";
import { signOut } from "../components/pages/login/idp-selection";

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
    if (Array.isArray(successCallback)) {
      successCallback.forEach(callback => handleSuccessCallback(store, callback, response, json));
    } else {

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
        store.dispatch(
          push(
            successCallback.redirectWithIdFromResponse
              ? `${successCallback.redirect}/${json?.data?.id}`
              : successCallback.redirect
          )
        );
      }
    }
  }
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
      db
    }
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

  const fetchPath = buildPath(path, options, params);

  const fetch = async () => {
    fetchStatus({ store, type }, "STARTED", true);

    try {
      const response = await window.fetch(fetchPath, fetchOptions);
      const json = await response.json();

      if (!response.ok) {
        fetchStatus({ store, type }, "FAILURE", json);

        if (response.status === 401) {
          const usingIdp = store.getState().getIn(["idp", "use_identity_provider"]);
          store.dispatch(attemptSignout(usingIdp, signOut));
        }
        handleSuccessCallback(store, failureCallback, response, json);
      } else {
        await handleSuccess(store, { type, json, normalizeFunc, path, db });
        handleSuccessCallback(store, successCallback, response, json);
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

const restMiddleware = options => store => next => action => {
  if (!(action.api && "path" in action.api) || !isOnline(store)) {
    return next(action);
  }

  return fetchPayload(action, store, options);
};

export default restMiddleware;
