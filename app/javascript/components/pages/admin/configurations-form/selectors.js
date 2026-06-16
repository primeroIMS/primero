import { fromJS } from "immutable";

import NAMESPACE from "../configurations-list/namespace";
import { SAVING } from "../../../../config";

export const getConfiguration = state => {
  return state.getIn(["records", "admin", NAMESPACE, "selectedConfiguration"], fromJS({}));
};

export const getErrors = state => {
  return state.getIn(["records", "admin", NAMESPACE, "errors"], false);
};

export const getServerErrors = state => {
  return state.getIn(["records", "admin", NAMESPACE, "serverErrors"], fromJS([]));
};

export const getSavingRecord = state => state.getIn(["records", "admin", NAMESPACE, SAVING], false);

export const getLoading = state => state.getIn(["records", "admin", NAMESPACE, "loading"], false);

export const getApplying = state => state.getIn(["records", "admin", NAMESPACE, "applying"], false);

export const getSending = state => state.getIn(["records", "admin", NAMESPACE, "sending"], false);
