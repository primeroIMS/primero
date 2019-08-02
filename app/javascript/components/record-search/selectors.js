export const selectSearchValue = (state, namespace) =>
  state.getIn(["records", namespace, "filters", "query"], "");
