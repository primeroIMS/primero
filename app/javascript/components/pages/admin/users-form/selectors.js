import { fromJS } from "immutable";

import NAMESPACE from "../namespace";

export const getUser = state => {
  return state.getIn(["records", NAMESPACE, "selectedUser"], fromJS({}));
};

export const getErrors = state => {
  return state.getIn(["records", NAMESPACE, "errors"], fromJS([]));
};
