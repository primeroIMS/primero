// import { fromJS } from "immutable";
import NAMESPACE from "./namespace";

export const getChips = (state, props) => {
  return state.getIn(["filters", NAMESPACE, props.id], "");
};
