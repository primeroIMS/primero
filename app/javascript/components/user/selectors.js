import { List } from "immutable";

import NAMESPACE from "./namespace";

export const currentUser = state => state.getIn([NAMESPACE, "username"]);

export const getPermissions = state => {
  return state.getIn([NAMESPACE, "permissions"], List([]));
};

export const getPermissionsByRecord = (state, recordType) => {
  return state.getIn([NAMESPACE, "permissions", recordType], List([]));
};

export const hasUserPermissions = state => {
  return state.hasIn([NAMESPACE, "permissions"], false);
};
