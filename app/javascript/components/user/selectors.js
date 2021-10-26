import { List, fromJS } from "immutable";
import createCachedSelector from "re-reselect";

import { SAVING } from "../../config";
import { cachedSelectorOptions } from "../../libs/use-memoized-selector";

import NAMESPACE from "./namespace";
import { PERMISSIONS, LIST_HEADERS, PERMITTED_FORMS } from "./constants";

export const currentUser = state => state.getIn([NAMESPACE, "username"]);

export const getPermissions = state => {
  return state.getIn([NAMESPACE, PERMISSIONS], List([]));
};

export const getPermissionsByRecord = createCachedSelector(
  getPermissions,
  (_state, recordType) => recordType,
  (data, recordType) => {
    return data.get(recordType, List([]));
  }
)(cachedSelectorOptions());

export const hasUserPermissions = state => {
  return state.hasIn([NAMESPACE, PERMISSIONS], false);
};

export const getIsAuthenticated = state => state.getIn([NAMESPACE, "isAuthenticated"], false);

export const getListHeaders = (state, resource) => state.getIn([NAMESPACE, LIST_HEADERS, resource], List([]));

export const getPermittedFormsIds = state => state.getIn([NAMESPACE, PERMITTED_FORMS], fromJS({}));

export const getPermittedRoleUniqueIds = state => state.getIn([NAMESPACE, "permittedRoleUniqueIds"], fromJS({}));

export const getReportingLocationConfig = state => state.getIn([NAMESPACE, "reportingLocationConfig"], fromJS({}));

export const getUser = state => {
  return state.get(NAMESPACE, fromJS({}));
};

export const getUserSavingRecord = state => state.getIn([NAMESPACE, SAVING], false);

export const getServerErrors = state => {
  return state.getIn([NAMESPACE, "serverErrors"], fromJS([]));
};

export const getSavingPassword = state => state.getIn([NAMESPACE, "resetPassword", "saving"], false);

export const getCurrentUserGroupPermission = state => state.getIn([NAMESPACE, "roleGroupPermission"], fromJS([]));

export const getCurrentUserGroupsUniqueIds = state => state.getIn([NAMESPACE, "userGroupUniqueIds"], fromJS([]));

export const getAssignedAgency = state => state.getIn([NAMESPACE, "agencyId"], fromJS([]));

export const getCodeOfConductId = state => state.getIn([NAMESPACE, "codeOfConductId"], null);

export const getCodeOfConductAccepteOn = state => state.getIn([NAMESPACE, "codeOfConductAcceptedOn"], null);
