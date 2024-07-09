// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export const getDisableLocationsLoading = state =>
  state.getIn(["records", "admin", "locations", "disableLocations", "loading"], false);

export const getDisableLocationsErrors = state =>
  state.getIn(["records", "admin", "locations", "disableLocations", "errors"], false);
