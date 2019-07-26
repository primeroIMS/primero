import qs from "qs";
import { attemptSignout } from "components/pages/login";

export const queryParams = {
  toString: obj => qs.stringify(obj),
  parse: str => qs.parse(str)
};

const restMiddleware = options => store => next => action => {
  if (!(action.api && "path" in action.api)) {
    return next(action);
  }

  // TODO: We will store this elsewhere in the future. This is not secure
  const token = localStorage.getItem("jwt");

  const headers = {
    "content-type": "application/json"
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const defaultFetchOptions = {
    method: "GET",
    mode: "same-origin",
    credentials: "same-origin",
    cache: "no-cache",
    redirect: "follow",
    headers: new Headers(headers)
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
        successCallback(response, json);
      }
    }

    store.dispatch({
      type: `${type}_FINISHED`,
      payload: false
    });
  };

  return fetch();
};

export default restMiddleware;
