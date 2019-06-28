import NAMESPACE from "./namespace";

export const getSelect = (state, props) => {
  return state.getIn(["filters", NAMESPACE, props.id], []);
};
