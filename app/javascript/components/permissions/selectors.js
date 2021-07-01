/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";
import { createCachedSelector } from "re-reselect";

export const getPermissionsByRecord = createCachedSelector(
  state => state.getIn(["user", "permissions"], fromJS({})),
  (_state, recordType) => recordType,
  (data, recordType) => data.getIn([recordType], fromJS([]))
)((_state, recordType) => recordType);
