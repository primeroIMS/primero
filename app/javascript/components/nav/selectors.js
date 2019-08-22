import NAMESPACE from "./namespace";

export const selectDrawerOpen = state =>
  state.getIn(["ui", NAMESPACE, "drawerOpen"], false);

export const selectUsername = state => state.getIn(["user", "username"], "");
