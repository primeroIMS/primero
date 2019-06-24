import NAMESPACE from "./namespace";

export const selectTab = state => state.getIn([NAMESPACE, "tabValue"]);
