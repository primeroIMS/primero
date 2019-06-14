import NAMESPACE from "./namespace";

export const selectRecords = state => state.getIn([NAMESPACE, "records"], {});

export const selectFilters = state => state.getIn([NAMESPACE, "filters"], {});

export const selectMeta = state => state.getIn([NAMESPACE, "metadata"], {});

export const selectLoading = state =>
  state.getIn([NAMESPACE, "loading"], false);
