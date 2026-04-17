export const getDisableLocationsLoading = state =>
  state.getIn(["records", "admin", "locations", "disableLocations", "loading"], false);

export const getDisableLocationsErrors = state =>
  state.getIn(["records", "admin", "locations", "disableLocations", "errors"], false);
