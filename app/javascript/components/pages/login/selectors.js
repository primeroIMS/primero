import NAMESPACE from "./namespace";

export const selectModule = state => state.getIn([NAMESPACE, "module"]);
export const selectAgency = state => state.getIn([NAMESPACE, "agency"]);
