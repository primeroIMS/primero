import NAMESPACE from "./namespace";

export const selectUserModules = state => state.getIn([NAMESPACE, "data"], []);
