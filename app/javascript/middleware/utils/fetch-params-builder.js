import { DEFAULT_FETCH_OPTIONS } from "../constants";

import buildPath from "./build-path";
import getToken from "./get-token";

const fetchParamsBuilder = (api, options, controller) => {
  const { path, body, params, method, external } = api;

  const fetchOptions = {
    ...DEFAULT_FETCH_OPTIONS,
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

export default fetchParamsBuilder;
