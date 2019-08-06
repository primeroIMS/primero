import NAMESPACE from "./namespace";

export const selectDrawerOpen = state =>
  state.getIn(["ui", NAMESPACE, "drawerOpen"], false);
