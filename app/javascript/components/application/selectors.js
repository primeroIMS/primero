import { Map, fromJS } from "immutable";

import { PERMISSIONS, RESOURCE_ACTIONS } from "./constants";
import NAMESPACE from "./namespace";

export const selectAgencies = state =>
  state.getIn([NAMESPACE, "agencies"], fromJS([]));

export const getAgenciesWithService = (state, service) =>
  selectAgencies(state).filter(agency =>
    agency.get("services", fromJS([])).includes(service)
  );

export const selectModules = state =>
  state.getIn([NAMESPACE, "modules"], fromJS([]));

export const selectLocales = state =>
  state.getIn([NAMESPACE, "locales"], fromJS([]));

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
  state.getIn([NAMESPACE, "reportingLocationConfig"], fromJS({}));

export const getAgencyLogos = state =>
  state.getIn(["records", "support", "data", "agencies"], fromJS([]));

export const getSystemPermissions = state =>
  state.getIn([NAMESPACE, PERMISSIONS], fromJS({}));

export const getResourceActions = (state, resource) =>
  getSystemPermissions(state).getIn([RESOURCE_ACTIONS, resource], fromJS([]));
