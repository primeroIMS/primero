import NAMESPACE from "./namespace";

export const getCheckBoxes = (state, props) => {
  return state.getIn(["filters", NAMESPACE, props.id], []);
};
