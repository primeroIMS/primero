import { Record } from "immutable";

export const SavedSearchesRecord = Record({
  id: null,
  name: "",
  record_type: null,
  user_id: null,
  message: "",
  filters: []
});
