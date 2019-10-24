import { List } from "immutable";
import { RECORD_TYPES } from "config";
import NAMESPACE from "./namespace";

export const selectTransitions = (state, recordType, id) => {
  const type = RECORD_TYPES[recordType];
  const transitions = state
    .getIn(["records", NAMESPACE, "data"])
    .filter(f => f.record_type === type && f.record_id === id);
  return transitions.size ? transitions : List([]);
};
