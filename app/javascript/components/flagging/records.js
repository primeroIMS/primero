import { Record } from "immutable";

export const FlagRecord = Record({
  id: null,
  record_id: null,
  record_type: null,
  date: null,
  message: "",
  flagged_by: null
});
