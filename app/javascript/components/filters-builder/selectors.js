import NAMESPACE from "./namespace";

export const selectExpandedPanel = (state, recordType) =>
  state.getIn(["records", NAMESPACE, recordType], []);
