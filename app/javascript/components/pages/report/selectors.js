import { fromJS } from "immutable";
import NAMESPACE from "./namespace";

export const selectReport = state => {
  return state.getIn(["records", NAMESPACE, "selectedReport"], fromJS({}));
};
