// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import NAMESPACE from "./namespace";

export const selectSavedSearches = (state, recordType) => {
  const savedSearches = state.getIn(["records", NAMESPACE, "data"]).filter(f => f.record_type === recordType);

  return savedSearches.size ? savedSearches : fromJS([]);
};

export const selectSavedSearchesById = (state, recordType, id) => {
  const savedSearches = state
    .getIn(["records", NAMESPACE, "data"])
    .filter(f => f.record_type === recordType && f.id === id);

  return savedSearches.size ? savedSearches : fromJS({});
};
