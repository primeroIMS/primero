import NAMESPACE from "./namespace";

export const selectModules = state => state.getIn([NAMESPACE, "modules"]);

export const selectAgency = state => state.getIn([NAMESPACE, "agency"]);

export const selectAuthErrors = state =>
  state.getIn(["ui", NAMESPACE, "error"], "");
