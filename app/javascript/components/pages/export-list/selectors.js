import { fromJS } from "immutable";
import NAMESPACE from "./namespace";

export const selectExports = state => {
  return state.getIn(["records", NAMESPACE, "data"], fromJS([]));
};
