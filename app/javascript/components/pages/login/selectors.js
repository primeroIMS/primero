import NAMESPACE from "./namespace";

export const selectModule = state => state.getIn([NAMESPACE, "module"]);

export const selectAgency = state => state.getIn([NAMESPACE, "agency"]);

export const selectAuthErrors = state =>
  state.getIn(["ui", NAMESPACE, "error"], "");

export const selectAuthenticated = state =>
  state.getIn([NAMESPACE, "isAuthenticated"], false);

export const currentUser = state => state.getIn([NAMESPACE, "username"]);
