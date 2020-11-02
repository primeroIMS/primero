import qs from "qs";

import { attemptSignout } from "../components/user";
import { FETCH_TIMEOUT, ROUTES } from "../config";
import DB, { syncIndexedDB, queueIndexedDB, METHODS } from "../db";
import { signOut } from "../components/pages/login/idp-selection";
import EventManager from "../libs/messenger";
import { QUEUE_FAILED, QUEUE_SKIP, QUEUE_SUCCESS } from "../libs/queue";
import { applyingConfigMessage } from "../components/pages/admin/configurations-form/action-creators";
import { disableNavigation } from "../components/application/action-creators";

import {
  handleRestCallback,
  isOnline,
  partitionObject,
  processAttachments,
  defaultErrorCallback,
  startSignout,
  processSubforms,
  handleConfiguration,
  isServerOnline
} from "./utils";

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

const deleteFromQueue = fromQueue => {
  if (fromQueue) {
    queueIndexedDB.delete(fromQueue);
  }
};

async function handleSuccess(store, payload) {
  const { type, json, db, fromQueue } = payload;
  const payloadFromDB = await syncIndexedDB(db, json);

  deleteFromQueue(fromQueue);

  store.dispatch({
    type: `${type}_SUCCESS`,
    payload: payloadFromDB
  });
}

const getToken = () => {
  return sessionStorage.getItem("msal.idtoken");
};

const messageQueueFailed = fromQueue => {
  if (fromQueue) {
    EventManager.publish(QUEUE_FAILED);
  }
};

const messageQueueSkip = fromQueue => {
  if (fromQueue) {
    EventManager.publish(QUEUE_SKIP);
  }
};

const messageQueueSuccess = fromQueue => {
  if (fromQueue) {
    EventManager.publish(QUEUE_SUCCESS);
  }
};

const fetchParamsBuilder = (api, options, controller) => {
  const { path, body, params, method, external } = api;

  const fetchOptions = {
    ...defaultFetchOptions,
    method,
    signal: controller.signal,
    body: JSON.stringify(body)
  };

  const token = getToken();

  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  fetchOptions.headers = new Headers(Object.assign(fetchOptions.headers, headers));

  const fetchPath = buildPath(path, options, params, external);

  return { fetchOptions, fetchPath };
};

const fetchSinglePayload = (action, store, options) => {
  const controller = new AbortController();

  setTimeout(() => {
    controller.abort();
  }, FETCH_TIMEOUT);

  const {
    type,
    api: {
      id,
      recordType,
      path,
      body,
      params,
      method,
      normalizeFunc,
      successCallback,
      failureCallback,
      configurationCallback,
      db,
      external,
      queueAttachments
    },
    fromQueue
  } = action;

  const [attachments, formData] = queueAttachments
    ? partitionObject(body?.data, (value, key) =>
        store.getState().getIn(["forms", "attachmentFields"], []).includes(key)
      )
    : [false, false];

  const fetchOptions = {
    ...defaultFetchOptions,
    method,
    signal: controller.signal,
    ...((formData || body) && {
      body: JSON.stringify(formData ? { data: formData } : body)
    })
  };

  const token = getToken();

  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  fetchOptions.headers = new Headers(Object.assign(fetchOptions.headers, headers));

  const fetchPath = buildPath(path, options, params, external);

  const fetch = async () => {
    fetchStatus({ store, type }, "STARTED", true);

    try {
      const response = await window.fetch(fetchPath, fetchOptions);
      const { status } = response;
      const url = response.url.split("/");
      const checkHealthUrl = url.slice(url.length - 2, url.length).join("/");

      if (status === 503 || (status === 204 && `/${checkHealthUrl}` === ROUTES.check_health)) {
        handleConfiguration(status, store, options, response, { fetchStatus, fetchSinglePayload, type });
      } else {
        const json = status === 204 ? {} : await response.json();

        if (!response.ok) {
          fetchStatus({ store, type }, "FAILURE", json);

          if (status === 404) {
            deleteFromQueue(fromQueue);
            messageQueueSkip();
          } else if (fromQueue) {
            messageQueueFailed(fromQueue);
            defaultErrorCallback(store, response, json, recordType, fromQueue, id);
          } else if (failureCallback) {
            messageQueueFailed(fromQueue);
            handleRestCallback(store, failureCallback, response, json, fromQueue);
          } else {
            messageQueueFailed(fromQueue);
            defaultErrorCallback(store, response, json);
          }

          if (status === 401) {
            startSignout(store, attemptSignout, signOut);
          }
        } else {
          await handleSuccess(store, {
            type,
            json,
            normalizeFunc,
            path,
            db,
            fromQueue
          });

          if (attachments) {
            processAttachments({
              attachments,
              id: id || json?.data?.id,
              recordType
            });
          }

          handleRestCallback(store, successCallback, response, json, fromQueue);

          messageQueueSuccess(fromQueue);
        }
        fetchStatus({ store, type }, "FINISHED", false);

        if (configurationCallback && response.ok) {
          store.dispatch(disableNavigation());
          handleRestCallback(store, applyingConfigMessage(), response, {});
          fetchSinglePayload(configurationCallback, store, options);
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e);

      messageQueueFailed(fromQueue);

      fetchStatus({ store, type }, "FAILURE", false);

      if (fromQueue) {
        defaultErrorCallback(store, {}, {}, recordType, fromQueue, id);
      } else if (failureCallback) {
        handleRestCallback(store, failureCallback, {}, {});
      } else {
        defaultErrorCallback(store, {}, {});
      }
    }
  };

  return fetch();
};

const fetchMultiPayload = (action, store, options) => {
  const controller = new AbortController();

  setTimeout(() => {
    controller.abort();
  }, FETCH_TIMEOUT);

  const { type, finishedCallback, finishedCallbackSubforms } = action;

  const fetchParams = action.api.map(apiParams => fetchParamsBuilder(apiParams, options, controller));

  const fetch = async () => {
    fetchStatus({ store, type }, "STARTED", true);
    const responses = await Promise.allSettled(
      fetchParams.map(fetchParam =>
        window
          .fetch(fetchParam.fetchPath, fetchParam.fetchOptions)
          .then(response =>
            response
              .json()
              .then(json => {
                let newJson = json;

                if (!response.ok) {
                  newJson = {
                    ...newJson,
                    errors: newJson.errors.map(error =>
                      error.detail
                        ? { ...error, value: JSON.parse(fetchParam.fetchOptions.body).data[error.detail] }
                        : error
                    )
                  };
                }

                return {
                  path: fetchParam.fetchPath,
                  status: response.status,
                  ok: response.ok,
                  json: newJson
                };
              })
              .catch(error => ({
                path: fetchParam.fetchPath,
                status: response.status,
                ok: response.ok,
                error
              }))
          )
          .catch(error => ({
            path: fetchParam.fetchPath,
            ok: false,
            error: error?.message
          }))
      )
    );

    const results = responses.map(result => result.value);

    if (results.find(result => result && result.status === 401)) {
      fetchStatus({ store, type }, "FAILURE", results);

      startSignout(store, attemptSignout, signOut);
    } else {
      store.dispatch({
        type: `${type}_SUCCESS`,
        payload: responses.map(result => result.value)
      });

      fetchStatus({ store, type }, "FINISHED", false);

      if (finishedCallback) {
        store.dispatch(finishedCallback);
      }

      if (finishedCallbackSubforms) {
        const subformsCallback = processSubforms(finishedCallbackSubforms, responses);

        fetchSinglePayload(subformsCallback, store, options);
      }
    }
  };

  return fetch();
};

function fetchPayload(action, store, options) {
  if (Array.isArray(action.api)) {
    return fetchMultiPayload(action, store, options);
  }

  return fetchSinglePayload(action, store, options);
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
  if (
    !(action.api && (Array.isArray(action.api) || "path" in action.api)) ||
    (!isOnline(store) && !isServerOnline(store))
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
