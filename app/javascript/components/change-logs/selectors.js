/* eslint-disable import/prefer-default-export */

import { List, fromJS } from "immutable";

import NAMESPACE from "./namespace";

export const getChangeLogs = (state, id, recordType) => {
  const changeLogs = state
    .getIn(["records", NAMESPACE, "data"], fromJS([]))
    .filter(log => log.record_type === recordType && log.record_id === id);

  return changeLogs.size ? changeLogs : List([]);
};
