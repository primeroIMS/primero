import { fromJS } from "immutable";
import NAMESPACE from "./namespace";

export const selectTasks = state => {
  return state.getIn(["records", NAMESPACE, "tasks"], fromJS([]));
};
