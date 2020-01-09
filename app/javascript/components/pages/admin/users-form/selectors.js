import { fromJS } from "immutable";

import NAMESPACE from "../namespace";

export const getUser = state => {
  return state.getIn(["records", NAMESPACE, "selectedUser"], fromJS({}));
};
