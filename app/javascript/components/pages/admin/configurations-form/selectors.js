import { fromJS } from "immutable";

import NAMESPACE from "../configurations-list/namespace";
import { SAVING } from "../../../../config";

export const getConfiguration = state => {
  return state.getIn(["records", NAMESPACE, "selectedConfiguration"], fromJS({}));
};

export const getErrors = state => {
  return state.getIn(["records", NAMESPACE, "errors"], false);
};

export const getServerErrors = state => {
  return state.getIn(["records", NAMESPACE, "serverErrors"], fromJS([]));
};

export const getSavingRecord = state => state.getIn(["records", NAMESPACE, SAVING], false);
