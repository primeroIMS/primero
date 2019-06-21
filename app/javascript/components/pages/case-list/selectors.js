import NAMESPACE from "./namespace";

export const selectCases = state =>
  state.getIn(["records", NAMESPACE, "cases"], {});

export const selectFilters = state =>
  state.getIn(["records", NAMESPACE, "filters"], {});

export const selectMeta = state =>
  state.getIn(["records", NAMESPACE, "metadata"], {});

export const selectLoading = state =>
  state.getIn(["records", NAMESPACE, "loading"], false);
