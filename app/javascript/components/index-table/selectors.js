import { Map } from "immutable";
import { keyIn } from "libs";

export const selectRecords = (state, namespace) => {
  const data = state.getIn(["records", namespace]);

  return data.filter(keyIn("data", "metadata"));
};

export const selectFilters = (state, namespace) =>
  state.getIn(["records", namespace, "filters"], Map({}));

export const selectLoading = (state, namespace) =>
  state.getIn(["records", namespace, "loading"]);

export const selectErrors = (state, namespace) =>
  state.getIn(["records", namespace, "errors"], false);
