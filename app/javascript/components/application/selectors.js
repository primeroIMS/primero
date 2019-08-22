import NAMESPACE from "./namespace";

export const selectAgencies = state => state.getIn([NAMESPACE, "agencies"], []);

export const selectModules = state => state.getIn([NAMESPACE, "modules"], []);

export const selectLocales = state => state.getIn([NAMESPACE, "locales"], []);
