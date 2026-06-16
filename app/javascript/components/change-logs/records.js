/* eslint-disable import/prefer-default-export */

import { List, Record } from "immutable";

export const ChangeLogsRecord = Record({
  record_id: null,
  record_type: null,
  datetime: null,
  user_name: null,
  action: null,
  record_changes: List([])
});
