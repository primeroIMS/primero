import NAMESPACE from "./namespace";

export const getTab = (state, recordType) => {
  return state.getIn(["ui", NAMESPACE, recordType, "current"]);
};
