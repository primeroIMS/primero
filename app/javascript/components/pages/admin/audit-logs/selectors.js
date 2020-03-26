import { List } from "immutable";

export const getFilterUsers = state =>
  state.getIn(
    ["records", "admin", "audit_logs", "filters", "performed_by", "data"],
    List([])
  );
