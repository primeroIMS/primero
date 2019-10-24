import { Record } from "immutable";

export const TransitionRecord = Record({
  id: null,
  type: null,
  record_id: null,
  record_type: null,
  transitioned_to: null,
  transitioned_by: null,
  notes: "",
  created_at: null
});
