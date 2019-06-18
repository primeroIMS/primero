export const selectRecords = (state, namespace) =>
  state.getIn([namespace, "records"], {});

export const selectFilters = (state, namespace) =>
  state.getIn([namespace, "filters"], {});

export const selectMeta = (state, namespace) =>
  state.getIn([namespace, "metadata"], {});

export const selectLoading = (state, namespace) =>
  state.getIn([namespace, "loading"], false);
