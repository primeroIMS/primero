import NAMESPACE from "./namespace";

export const selectExpandedPanel = (state, recordType) =>
  state.getIn(["ui", NAMESPACE, recordType], []);
