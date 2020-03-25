import { Map } from "immutable";

import { keyIn } from "../../libs";

export const getRecords = (state, namespace) => {
  const defaultPath = ["records", namespace];
  const path = Array.isArray(namespace) ? defaultPath.flat() : defaultPath;
  const data = state.getIn(path, Map({}));

  return data?.filter(keyIn("data", "metadata"));
};

export const getFilters = (state, namespace) =>
  state.getIn(["records", namespace, "filters"], Map({}));

export const getLoading = (state, namespace) =>
  state.getIn(["records", namespace, "loading"]);

export const getErrors = (state, namespace) =>
  state.getIn(["records", namespace, "errors"], false);
