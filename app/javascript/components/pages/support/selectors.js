import { fromJS } from "immutable";
import NAMESPACE from "./namespace";

export const selectSupportData = state =>
  state.getIn(["records", NAMESPACE, "data"], fromJS({}));
