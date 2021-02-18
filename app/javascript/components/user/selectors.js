import { List, fromJS } from "immutable";

import { SAVING } from "../../config";
import { getLocations } from "../record-form/selectors";

import NAMESPACE from "./namespace";
import { PERMISSIONS, LIST_HEADERS, PERMITTED_FORMS } from "./constants";

export const currentUser = state => state.getIn([NAMESPACE, "username"]);

export const getPermissions = state => {
  return state.getIn([NAMESPACE, PERMISSIONS], List([]));
};

export const getPermissionsByRecord = (state, recordType) => {
  return state.getIn([NAMESPACE, PERMISSIONS, recordType], List([]));
};

export const hasUserPermissions = state => {
  return state.hasIn([NAMESPACE, PERMISSIONS], false);
};

export const getIsAuthenticated = state => state.getIn([NAMESPACE, "isAuthenticated"], false);

export const getListHeaders = (state, resource) => state.getIn([NAMESPACE, LIST_HEADERS, resource], List([]));

export const getPermittedFormsIds = state => state.getIn([NAMESPACE, PERMITTED_FORMS], List([]));

export const getReportingLocationConfig = state => state.getIn([NAMESPACE, "reportingLocationConfig"], fromJS({}));

export const getUser = state => {
  return state.get(NAMESPACE, fromJS({}));
};

export const getUserLocationsByAdminLevel = state => {
  const userLocationCode = getUser(state).get("location", "");
  const locations = getLocations(state);
  const maxAdminLevel = locations.map(location => location.get("admin_level")).max();

  if (!userLocationCode) {
    return locations;
  }

  const userLocation = locations.filter(location => location.get("code") === userLocationCode);
  const userLocationAdminLevel = userLocation.first().get("admin_level");

  if (userLocation.size === 1 && userLocationAdminLevel === maxAdminLevel) {
    return userLocation;
  }

  return locations.filter(location => location.get("admin_level") >= userLocationAdminLevel);
};

export const getUserSavingRecord = state => state.getIn([NAMESPACE, SAVING], false);

export const getServerErrors = state => {
  return state.getIn([NAMESPACE, "serverErrors"], fromJS([]));
};

export const getSavingPassword = state => state.getIn([NAMESPACE, "resetPassword", "saving"], false);

export const getCurrentUserGroupPermission = state => state.getIn([NAMESPACE, "roleGroupPermission"], fromJS([]));

export const getCurrentUserGroupsUniqueIds = state => state.getIn([NAMESPACE, "userGroupUniqueIds"], fromJS([]));

export const getAssignedAgency = state => state.getIn([NAMESPACE, "agencyId"], fromJS([]));
