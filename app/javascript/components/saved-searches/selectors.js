import { List } from "immutable";
import NAMESPACE from "./namespace";

export const selectSavedSearches = (state, recordType) => {
  const savedSearches = state
    .getIn(["records", NAMESPACE, "data"])
    .filter(f => f.record_type === recordType);

  return savedSearches.size ? savedSearches : List([]);
};
