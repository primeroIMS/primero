import qs from "qs";

export const queryParams = {
  toString: obj => qs.stringify(obj),
  parse: str => qs.parse(str)
};

const defaultFetchOptions = {
  method: "GET",
  mode: "same-origin",
  credentials: "same-origin",
  cache: "no-cache",
  redirect: "follow"
};

const restMiddleware = options => store => next => action => {
  if (!(action.api && "path" in action.api)) {
    return next(action);
  }

  const { type, api } = action;
  const { path, body, params, method } = api;
  const fetchOptions = Object.assign({}, defaultFetchOptions, method);

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

    if (!response.ok) {
      store.dispatch({
        type: `${type}_FAILURE`,
        payload: response.error
      });
    }

    const json = await response.json();

    store.dispatch({
      type: `${type}_SUCCESS`,
      payload: json
    });

    store.dispatch({
      type: `${type}_FINISHED`,
      payload: false
    });
  };

  return fetch();
};

export default restMiddleware;
