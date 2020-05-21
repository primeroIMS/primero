import { fromJS } from "immutable";

import { SAVING } from "../../../../config";

export const getLookup = state => {
  return state.getIn(
    ["records", "admin", "lookups", "selectedLookup"],
    fromJS({})
  );
};

export const getSavingLookup = state =>
  state.getIn(["records", "admin", "lookups", SAVING], false);
