export const NAME = "ReportsForm";
export const NAME_FIELD = "name.en";
export const DESCRIPTION_FIELD = "description.en";
export const MODULES_FIELD = "modules";
export const RECORD_TYPE_FIELD = "record_type";
export const AGGREGATE_BY_FIELD = "aggregate_by";
export const DISAGGREGATE_BY_FIELD = "disaggregate_by";
export const GROUP_AGES_FIELD = "group_ages";
export const GROUP_DATES_BY_FIELD = "group_dates_by";
export const IS_GRAPH_FIELD = "is_graph";
export const EMPTY_ROWS_FIELD = "empty_rows";
export const REPORTABLE_TYPES = {
  case: {
    id: "case",
    parentRecordType: "case"
  },
  incident: {
    id: "incident",
    parentRecordType: "incident"
  },
  tracing_request: {
    id: "tracing_request",
    parentRecordType: "tracing_request"
  },
  violation: {
    id: "violation",
    parentRecordType: "incident"
  },
  reportable_protection_concern: {
    id: "reportable_protection_concern",
    parentRecordType: "case"
  },
  reportable_service: {
    id: "reportable_service",
    parentRecordType: "case"
  },
  reportable_follow_up: {
    id: "reportable_follow_up",
    parentRecordType: "case"
  }
};
