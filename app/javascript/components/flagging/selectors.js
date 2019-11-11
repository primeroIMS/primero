import { List } from "immutable";

import NAMESPACE from "./namespace";

export const selectFlags = (state, id, recordType) => {
  const flags = state
    .getIn(["records", NAMESPACE, "data"])
    .filter(f => f.record_type === recordType && f.record_id === id);

  return flags.size ? flags : List([]);
};
