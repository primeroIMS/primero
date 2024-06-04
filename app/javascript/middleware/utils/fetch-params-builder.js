// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { getIDPToken } from "../../components/login/components/idp-selection/auth-provider";
import { DEFAULT_FETCH_OPTIONS } from "../constants";

import buildPath from "./build-path";
import getCSRFToken from "./get-csrf-token";

const fetchParamsBuilder = async (api, options, controller) => {
  const { path, body, params, method, external } = api;

  const fetchOptions = {
    ...DEFAULT_FETCH_OPTIONS,
    method,
    signal: controller.signal,
    body: JSON.stringify(body)
  };

  const token = await getIDPToken();

  const headers = {
    "X-CSRF-Token": getCSRFToken()
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  fetchOptions.headers = new Headers(Object.assign(fetchOptions.headers, headers));

  const fetchPath = buildPath(path, options, params, external);

  return { fetchOptions, fetchPath };
};

export default fetchParamsBuilder;
