import NAMESPACE from "./namespace";

export const selectDrawerOpen = state => state.getIn([NAMESPACE, "drawerOpen"]);
