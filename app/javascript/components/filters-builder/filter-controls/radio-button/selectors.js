import { fromJS } from "immutable";
import NAMESPACE from "./namespace";

export const getRadioButtons = (state, props) => {
  return state.getIn(["filters", NAMESPACE, props.id], fromJS([]));
};
