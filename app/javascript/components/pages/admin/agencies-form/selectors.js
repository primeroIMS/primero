import { fromJS } from "immutable";

import NAMESPACE from "../agencies-list/namespace";

export const getAgency = state => {
  return state.getIn(["records", NAMESPACE, "selectedAgency"], fromJS({}));
};

export const getErrors = state => {
  return state.getIn(["records", NAMESPACE, "errors"], false);
};

export const getServerErrors = state => {
  return state.getIn(["records", NAMESPACE, "serverErrors"], fromJS([]));
};

export const getSavingRecord = state =>
  state.getIn(["records", NAMESPACE, "saving"], false);
