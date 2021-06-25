/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";
import { createCachedSelector } from "re-reselect";

// export const getPermissionsByRecord = (state, recordType) => {
//   return state.getIn(["user", "permissions", recordType], fromJS([]));
// };

export const getPermissionsByRecord = createCachedSelector(
  state => state,
  (_state, recordType) => recordType,
  (state, recordType) => state.getIn(["user", "permissions", recordType], fromJS([]))
)((_state, recordType) => recordType);
