/* eslint-disable import/prefer-default-export */

import { List, fromJS } from "immutable";

import NAMESPACE from "./namespace";

export const selectFlags = (state, id, recordType) => {
  const flags = state
    .getIn(["records", NAMESPACE, "data"], fromJS([]))
    .filter(f => f.record_type === recordType && f.record_id === id);

  return flags.size ? flags : List([]);
};

export const getActiveFlags = (state, id, recordType) => {
  const flags = selectFlags(state, id, recordType);

  return flags.filter(flag => !flag.removed);
};

export const getResolvedFlags = (state, id, recordType) => {
  const flags = selectFlags(state, id, recordType);

  return flags.filter(flag => flag.removed);
};

export const getSelectedFlag = state => state.getIn(["records", NAMESPACE, "selectedFlag"]);
