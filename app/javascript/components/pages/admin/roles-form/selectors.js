import { fromJS } from "immutable";

import NAMESPACE from "./namespace";

export const getRole = state =>
  state.getIn(["records", "admin", NAMESPACE, "selectedRole"], fromJS({}));

export const getServerErrors = state =>
  state.getIn(["records", "admin", NAMESPACE, "serverErrors"], fromJS([]));

export const getLoading = state =>
  state.getIn(["records", "admin", NAMESPACE, "loading"], false);

export const getSavingRecord = state =>
  state.getIn(["records", "admin", NAMESPACE, "saving"], false);
