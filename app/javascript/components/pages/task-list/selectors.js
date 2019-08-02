import { List, Map } from "immutable";
import NAMESPACE from "./namespace";

export const selectTasks = state => {
  return state.getIn(["records", NAMESPACE, "data"], List([]));
};

export const selectMeta = (state, namespace) =>
  state.getIn(["records", namespace, "metadata"], Map({}));
