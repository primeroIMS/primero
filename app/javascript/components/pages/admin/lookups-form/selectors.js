import { fromJS } from "immutable";

export const getLookup = state => {
  return state.getIn(
    ["records", "admin", "lookups", "selectedLookup"],
    fromJS({})
  );
};
