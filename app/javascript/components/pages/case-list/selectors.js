import NAMESPACE from "./namespace";

export const selectCases = state => state.getIn([NAMESPACE, "cases"], {});

export const selectFilters = state => state.getIn([NAMESPACE, "filters"], {});

export const selectMeta = state => state.getIn([NAMESPACE, "metadata"], {});

export const selectLoading = state =>
  state.getIn([NAMESPACE, "loading"], false);
