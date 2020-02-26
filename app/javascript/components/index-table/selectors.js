import { Map } from "immutable";

import { keyIn } from "../../libs";

export const getRecords = (state, namespace) => {
  const data = state.getIn(["records", namespace].flat());

  return data.filter(keyIn("data", "metadata"));
};

export const getFilters = (state, namespace) =>
  state.getIn(["records", namespace, "filters"].flat(), Map({}));

export const getLoading = (state, namespace) =>
  state.getIn(["records", namespace, "loading"].flat());

export const getErrors = (state, namespace) =>
  state.getIn(["records", namespace, "errors"].flat(), false);
