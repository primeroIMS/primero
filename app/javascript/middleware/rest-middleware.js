import qs from "qs";
import { attemptSignout } from "components/user";
import { FETCH_TIMEOUT } from "config";
import { push } from "connected-react-router";

export const queryParams = {
  toString: obj => qs.stringify(obj),
  parse: str => qs.parse(str)
};

const restMiddleware = options => store => next => action => {
  if (!(action.api && "path" in action.api)) {
    return next(action);
  }

  const controller = new AbortController();

  setTimeout(() => {
    controller.abort();
  }, FETCH_TIMEOUT);

  const defaultFetchOptions = {
    method: "GET",
    mode: "same-origin",
    credentials: "same-origin",
    cache: "no-cache",
    redirect: "follow",
    headers: new Headers({
      "content-type": "application/json"
    }),
    signal: controller.signal
  };

  const { type, api } = action;
  const { path, body, params, method, normalizeFunc, successCallback } = api;
  const fetchOptions = Object.assign({}, defaultFetchOptions, { method });

  let fetchPath = `${options.baseUrl}/${path}`;

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  if (params) {
    fetchPath += `?${queryParams.toString(params)}`;
  }

  const fetch = async () => {
    store.dispatch({
      type: `${type}_STARTED`,
      payload: true
    });

    try {
      const response = await window.fetch(fetchPath, fetchOptions);
      const json = await response.json();

      if (!response.ok) {
        store.dispatch({
          type: `${type}_FAILURE`,
          payload: json
        });

        if (response.status === 401) {
          store.dispatch(attemptSignout());
        }
      } else {
        store.dispatch({
          type: `${type}_SUCCESS`,
          payload: normalizeFunc ? normalizeFunc(json.data).entities : json
        });

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

      store.dispatch({
        type: `${type}_FINISHED`,
        payload: false
      });
    } catch (e) {
      store.dispatch({
        type: `${type}_FAILURE`,
        payload: true
      });
    }
  };

  return fetch();
};

export default restMiddleware;
