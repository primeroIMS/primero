import { List } from "immutable";
import NAMESPACE from "./namespace";

export const currentUser = state => state.getIn([NAMESPACE, "username"]);

export const getPermissionsByRecord = (state, recordType) => {
  return state.getIn([NAMESPACE, "permissions", recordType], List([]));
};
