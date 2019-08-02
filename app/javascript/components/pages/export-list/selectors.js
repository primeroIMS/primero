import { Map, List } from "immutable";
import NAMESPACE from "./namespace";

export const selectExports = state => {
  return state.getIn(["records", NAMESPACE, "data"], List([]));
};

export const selectMeta = state =>
  state.getIn(["records", NAMESPACE, "metadata"], Map({}));
