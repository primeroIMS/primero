import { List } from "immutable";

import NAMESPACE from "./namespace";
import { PERMISSIONS, LIST_HEADERS } from "./constants";

export const currentUser = state => state.getIn([NAMESPACE, "username"]);

export const getPermissions = state => {
  return state.getIn([NAMESPACE, PERMISSIONS], List([]));
};

export const getPermissionsByRecord = (state, recordType) => {
  return state.getIn(
    [NAMESPACE, PERMISSIONS, "resource_actions", recordType],
    List([])
  );
};

export const hasUserPermissions = state => {
  return state.hasIn([NAMESPACE, PERMISSIONS], false);
};

export const getIsAuthenticated = state =>
  state.getIn([NAMESPACE, "isAuthenticated"], false);

export const getListHeaders = (state, resource) =>
  state.getIn([NAMESPACE, LIST_HEADERS, resource], List([]));
