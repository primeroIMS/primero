// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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

export const getSavingRecord = state => state.getIn(["records", NAMESPACE, SAVING], false);

export const getLoading = state => state.getIn(["records", NAMESPACE, "loading"], false);

export const getSavingNewPasswordReset = state =>
  state.getIn(["records", NAMESPACE, "newPasswordReset", SAVING], false);

export const getPasswordResetLoading = state =>
  state.getIn(["records", NAMESPACE, "passwordResetRequest", "loading"], false);

export const getRecordsUpdate = state => state.getIn(["records", NAMESPACE, "recordsUpdate"], false);

export const getUserSaved = state => state.getIn(["records", NAMESPACE, "userSaved"], false);

export const getTotalUsersEnabled = state => state.getIn(["records", NAMESPACE, "metadata", "total_enabled"]);
