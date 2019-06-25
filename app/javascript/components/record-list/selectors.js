export const selectRecords = (state, namespace) =>
  state.getIn(["records", namespace, "data"], {});

export const selectFilters = (state, namespace) =>
  state.getIn(["records", namespace, "filters"], {});

export const selectMeta = (state, namespace) =>
  state.getIn(["records", namespace, "metadata"], {});

export const selectLoading = (state, namespace) =>
  state.getIn(["records", namespace, "loading"], false);
