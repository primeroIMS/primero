export const NAME = "ReportsForm";
export const NAME_FIELD = "name.en";
export const DESCRIPTION_FIELD = "description.en";
export const MODULES_FIELD = "module_id";
export const RECORD_TYPE_FIELD = "record_type";
export const AGGREGATE_BY_FIELD = "aggregate_by";
export const DISAGGREGATE_BY_FIELD = "disaggregate_by";
export const GROUP_AGES_FIELD = "group_ages";
export const GROUP_DATES_BY_FIELD = "group_dates_by";
export const IS_GRAPH_FIELD = "graph";
export const REPORTABLE_TYPES = Object.freeze({
  case: "case",
  incident: "incident",
  tracing_request: "tracing_request",
  violation: "violation",
  reportable_protection_concern: "protection_concern_details",
  reportable_service: "services",
  reportable_follow_up: "followup"
});
export const REPORT_FIELD_TYPES = Object.freeze({
  horizontal: "horizontal",
  vertical: "vertical"
});
