import { fromJS } from "immutable";

import NAMESPACE from "./namespace";

export const getRole = state => {
  return state.getIn(["records", NAMESPACE, "selectedRole"], fromJS({}));
};

export const getErrors = state => {
  return state.getIn(["records", NAMESPACE, "errors"], false);
};

export const getServerErrors = state => {
  return state.getIn(["records", NAMESPACE, "serverErrors"], fromJS([]));
};

export const getSavingRecord = state =>
  state.getIn(["records", NAMESPACE, "saving"], false);
