import NAMESPACE from "./namespace";

export const selectAnchorEl = state => state.getIn([NAMESPACE, "anchorEl"]);
