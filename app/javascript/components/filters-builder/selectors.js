import NAMESPACE from "./namespace";

export const selectExpandedPanel = state =>
  state.getIn(["filters", NAMESPACE], []);
