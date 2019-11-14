import { List } from "immutable";

import NAMESPACE from "./namespace";
import { PERMISSIONS } from "./constants";

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
