import { fromJS } from "immutable";

import NAMESPACE from "../namespace";
import { SAVING } from "../../../../config";

export const getUser = state => {
  return state.getIn(["records", NAMESPACE, "selectedUser"], fromJS({}));
};

export const getErrors = state => {
  return state.getIn(["records", NAMESPACE, "errors"], false);
};

export const getServerErrors = state => {
  return state.getIn(["records", NAMESPACE, "serverErrors"], fromJS([]));
};

export const getIdentityProviders = state => {
  return state.get("idp", fromJS({}));
};

export const getSavingRecord = state =>
  state.getIn(["records", NAMESPACE, SAVING], false);
