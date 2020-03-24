import { Map } from "immutable";

import { keyIn } from "../../libs";

const getNamespacePath = namespace => {
  const defaultPath = ["records", namespace];

  return Array.isArray(namespace) ? defaultPath.flat() : defaultPath;
};

export const getRecords = (state, namespace) => {
  const data = state.getIn(getNamespacePath(namespace), Map({}));

  return data?.filter(keyIn("data", "metadata"));
};

export const getFilters = (state, namespace) =>
  state.getIn(getNamespacePath(namespace).concat("filters"), Map({}));

export const getLoading = (state, namespace) =>
  state.getIn(getNamespacePath(namespace).concat("loading"));

export const getErrors = (state, namespace) =>
  state.getIn(getNamespacePath(namespace).concat("errors"), false);
