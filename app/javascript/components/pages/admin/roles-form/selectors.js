import { fromJS } from "immutable";

import NAMESPACE from "./namespace";

export const getRole = state => {
  return state.getIn(
    ["records", "admin", NAMESPACE, "selectedRole"],
    fromJS({})
  );
};

export const getServerErrors = state => {
  return state.getIn(
    ["records", "admin", NAMESPACE, "serverErrors"],
    fromJS([])
  );
};

export const getSavingRecord = state =>
  state.getIn(["records", "admin", NAMESPACE, "saving"], false);
