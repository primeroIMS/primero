import NAMESPACE from "./namespace";

export const getTab = state => {
  return state.getIn(["records", NAMESPACE, "current"]);
};
