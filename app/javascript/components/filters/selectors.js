import NAMESPACE from "./namespace";

export const getTab = (state, recordType) => {
  return state.getIn(["ui", NAMESPACE, recordType, "current"], 0);
};

export const getFiltersByRecordType = (state, recordType) => {
  return state.getIn(["user", "filters", recordType]);
};
