// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export const NAME = "RecordListContainer";
export const ALERTS = "alerts";
export const COMPLETE = "complete";
export const ALERTS_COLUMNS = Object.freeze({
  alert_count: "alert_count",
  flag_count: "flag_count",
  photo: "photo"
});
export const FILTER_CONTAINER_NAME = `${NAME}FilterContainer`;
export const DEFAULT_FILTERS = {
  fields: "short",
  status: ["open"],
  record_state: ["true"]
};
export const SEARCH_AND_CREATE_WORKFLOW = "search_and_create_workflow";
export const ID_COLUMNS = Object.freeze({
  short_id: "short_id",
  case_id_display: "case_id_display"
});
export const SEARCH_OR_CREATE_FILTERS = Object.freeze({ ...DEFAULT_FILTERS, status: ["open", "closed"] });
