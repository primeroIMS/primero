// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import fetchMultiPayload from "./fetch-multiple-payload";
import fetchSinglePayload from "./fetch-single-payload";

async function fetchPayload(action, store, options) {
  if (Array.isArray(action.api)) {
    return fetchMultiPayload(action, store, options);
  }

  return fetchSinglePayload(action, store, options);
}

export default fetchPayload;
