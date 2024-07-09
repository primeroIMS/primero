// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { DATE_FIELD, NUMERIC_FIELD, RADIO_FIELD, SELECT_FIELD, TICK_FIELD } from "../form/constants";

export const FORM_ID = "reports-form";
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
export const EXCLUDE_EMPTY_ROWS_FIELD = "exclude_empty_rows";
export const DISABLED_FIELD = "disabled";
export const FILTERS_FIELD = "filters";
export const STATUS_FIELD = "status";
export const RECORD_STATE_FIELD = "record_state";
export const CONSENT_REPORTING_FIELD = "consent_reporting";
export const REPORTABLE_TYPES = Object.freeze({
  case: "case",
  incident: "incident",
  tracing_request: "tracing_request",
  violation: "violation",
  reportable_protection_concern: "protection_concern_details",
  reportable_service: "services",
  reportable_follow_up: "followup"
});

export const DEFAULT_CONSTRAINTS = Object.freeze({
  "<": "report.filters.less_than",
  ">": "report.filters.greater_than",
  "=": "report.filters.equal_to",
  not_null: "report.filters.not_blank"
});

export const DATE_CONSTRAINTS = Object.freeze({
  "<": "report.filters.before",
  ">": "report.filters.after"
});

export const CONSTRAINTS = Object.freeze({
  default: DEFAULT_CONSTRAINTS,
  date: DATE_CONSTRAINTS
});

export const ALLOWED_FIELD_TYPES = Object.freeze([DATE_FIELD, NUMERIC_FIELD, RADIO_FIELD, SELECT_FIELD, TICK_FIELD]);

export const ALLOWED_FIELD_NAMES = ["created_by", "created_by_groups", "owned_by", "owned_by_groups"];

export const REPORT_FIELD_TYPES = Object.freeze({
  horizontal: "horizontal",
  vertical: "vertical"
});

export const SHARED_FILTERS = Object.freeze([
  Object.freeze({ attribute: STATUS_FIELD, value: ["open"] }),
  Object.freeze({ attribute: RECORD_STATE_FIELD, value: ["true"] }),
  Object.freeze({ attribute: CONSENT_REPORTING_FIELD, value: ["true"] })
]);

export const NOT_NULL = "not_null";

export const DATE = "date";

export const DEFAULT_FILTERS = Object.freeze({
  case: [...SHARED_FILTERS],
  incident: [...SHARED_FILTERS],
  tracing_request: [...SHARED_FILTERS],
  reportable_service: [
    ...SHARED_FILTERS,
    { attribute: "service_type", constraint: NOT_NULL },
    { attribute: "service_appointment_date", constraint: NOT_NULL }
  ],
  reportable_follow_up: [...SHARED_FILTERS, { attribute: "followup_date", constraint: NOT_NULL }],
  reportable_protection_concern: [...SHARED_FILTERS, { attribute: "protection_concern_type", constraint: NOT_NULL }],
  violation: [...SHARED_FILTERS]
});

export const MINIMUM_REPORTABLE_FIELDS = Object.freeze({
  case: [
    STATUS_FIELD,
    "sex",
    "risk_level",
    "owned_by_agency_id",
    "owned_by",
    "workflow",
    "workflow_status",
    RECORD_STATE_FIELD,
    "associated_user_names",
    "owned_by_groups",
    "registration_date",
    "age",
    "owned_by_location",
    "location_current",
    CONSENT_REPORTING_FIELD
  ],
  incident: [
    RECORD_STATE_FIELD,
    STATUS_FIELD,
    "owned_by",
    "associated_user_names",
    "owned_by_groups",
    "incident_date_derived"
  ],
  tracing_request: [
    RECORD_STATE_FIELD,
    STATUS_FIELD,
    "inquiry_date",
    "owned_by",
    "associated_user_names",
    "owned_by_groups",
    "inquiry_date"
  ]
});

export const MATCH_REPORTABLE_TYPES = Object.freeze({
  reportable_protection_concern: "case",
  reportable_service: "case",
  reportable_follow_up: "case",
  violation: "incident"
});
