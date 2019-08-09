import { List, Map } from "immutable";
import NAMESPACE from "./namespace";

export const selectTasks = state => {
  return state.getIn(["records", NAMESPACE, "data"], List([]));
};

export const selectMeta = state =>
  state.getIn(["records", NAMESPACE, "metadata"], Map({}));
