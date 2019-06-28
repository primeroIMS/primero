import NAMESPACE from "./namespace";

export const getTab = state => {
  return state.getIn(["filters", NAMESPACE, "current"]);
};
