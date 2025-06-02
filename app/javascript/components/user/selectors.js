// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { List, fromJS } from "immutable";

import { SAVING } from "../../config";
import { MANAGED_REPORT_SCOPE } from "../permissions/constants";

import NAMESPACE from "./namespace";
import { PERMISSIONS, PERMITTED_FORMS } from "./constants";

export const currentUser = state => state.getIn([NAMESPACE, "username"]);

export const getPermissions = state => {
  return state.getIn([NAMESPACE, PERMISSIONS], List([]));
};

export const hasUserPermissions = state => {
  return state.hasIn([NAMESPACE, PERMISSIONS], false);
};

export const getIsAuthenticated = state => state.getIn([NAMESPACE, "isAuthenticated"], false);

export const getPermittedFormsIds = state => state.getIn([NAMESPACE, PERMITTED_FORMS], fromJS({}));

export const getPermittedRoleUniqueIds = state => state.getIn([NAMESPACE, "permittedRoleUniqueIds"], fromJS({}));

export const getReportingLocationConfig = state => state.getIn([NAMESPACE, "reportingLocationConfig"], fromJS({}));

export const getUser = state => {
  return state.get(NAMESPACE, fromJS({}));
};

export const getUserProperty = (state, property, defaultValue = false) => {
  const path = Array.isArray(property) ? [NAMESPACE, ...property] : [NAMESPACE, property];

  return state.getIn(path, defaultValue);
};

export const getUserSavingRecord = state => state.getIn([NAMESPACE, SAVING], false);

export const getServerErrors = state => {
  return state.getIn([NAMESPACE, "serverErrors"], fromJS([]));
};

export const getSavingPassword = state => state.getIn([NAMESPACE, "resetPassword", "saving"], false);

export const getCurrentUserGroupPermission = state => state.getIn([NAMESPACE, "roleGroupPermission"], fromJS([]));

export const getCurrentUserGroupsUniqueIds = state => state.getIn([NAMESPACE, "userGroupUniqueIds"], fromJS([]));

export const getAssignedAgency = state => state.getIn([NAMESPACE, "agencyId"], fromJS([]));
export const getAssignedAgencyUniqueId = state => state.getIn([NAMESPACE, "agencyUniqueId"], fromJS([]));

export const getCodeOfConductId = state => state.getIn([NAMESPACE, "codeOfConductId"], null);

export const getCodeOfConductAccepteOn = state => state.getIn([NAMESPACE, "codeOfConductAcceptedOn"], null);

export const getCurrentUserUserGroups = state => state.getIn([NAMESPACE, "userGroups"], fromJS([]));

export const hasPrimeroModule = (state, primeroModule) =>
  state.getIn([NAMESPACE, "modules"], fromJS([])).includes(primeroModule);

export const getNotificationSubscription = state => state.getIn([NAMESPACE, "notificationEndpoint"]);

export const getManagedReportScope = state => state.getIn([NAMESPACE, "managedReportScope"], null);

export const getIsManagedReportScopeAll = state => getManagedReportScope(state) === MANAGED_REPORT_SCOPE.ALL;

export const getCurrentUserModules = state => state.getIn([NAMESPACE, "modules"], fromJS([]));
