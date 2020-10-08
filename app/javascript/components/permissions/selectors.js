/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";

export const getPermissionsByRecord = (state, recordType) => {
  return state.getIn(["user", "permissions", recordType], fromJS([]));
};
