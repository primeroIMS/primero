import { fromJS } from "immutable";

import NAMESPACE from "../user-groups-list/namespace";

export const getUserGroup = state => {
  return state.getIn(["records", NAMESPACE, "selectedUserGroup"], fromJS({}));
};

export const getErrors = state => {
  return state.getIn(["records", NAMESPACE, "errors"], false);
};

export const getServerErrors = state => {
  return state.getIn(["records", NAMESPACE, "serverErrors"], fromJS([]));
};

export const getSavingRecord = state =>
  state.getIn(["records", NAMESPACE, "saving"], false);
