/* eslint-disable import/prefer-default-export */

import { List } from "immutable";

export const getFilterUsers = state =>
  state.getIn(["records", "admin", "audit_logs", "users", "data"], List([]));
