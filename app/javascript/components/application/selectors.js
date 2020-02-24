import { Map } from "immutable";

import NAMESPACE from "./namespace";

export const selectAgencies = state => state.getIn([NAMESPACE, "agencies"], []);

export const selectModules = state => state.getIn([NAMESPACE, "modules"], []);

export const selectLocales = state => state.getIn([NAMESPACE, "locales"], []);

export const selectUserModules = state =>
  state.getIn([NAMESPACE, "modules"], Map({})).filter(m => {
    const userModules = state.getIn(["user", "modules"], null);

    return userModules ? userModules.includes(m.unique_id) : false;
  });

export const selectModule = (state, id) => {
  return selectUserModules(state)
    .filter(f => f.unique_id === id)
    .first();
};

export const selectUserIdle = state =>
  state.getIn([NAMESPACE, "userIdle"], false);

export const selectNetworkStatus = state =>
  state.getIn([NAMESPACE, "online"], false);

export const getReportingLocationConfig = state =>
  state.getIn([NAMESPACE, "reportingLocationConfig"]);

export const getAgencyLogos = state =>
  state.getIn(["records", "support", "data", "agencies"], []);
