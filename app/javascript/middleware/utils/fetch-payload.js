import fetchMultiPayload from "./fetch-multiple-payload";
import fetchSinglePayload from "./fetch-single-payload";

function fetchPayload(action, store, options) {
  if (Array.isArray(action.api)) {
    return fetchMultiPayload(action, store, options);
  }

  return fetchSinglePayload(action, store, options);
}

export default fetchPayload;
