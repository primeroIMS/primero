export const FILTER_TYPES = Object.freeze({
  CHECKBOX: "checkbox",
  SELECT: "select",
  MULTI_SELECT: "multi_select",
  MULTI_TOGGLE: "multi_toggle",
  CHIPS: "chips",
  TOGGLE: "toggle",
  DATES: "dates"
});

export const HIDDEN_FIELDS = [
  "approval_status_bia",
  "approval_status_closure",
  "assessment_due_dates",
  "associated_user_names",
  "case_plan_due_dates",
  "fields",
  "followup_due_dates",
  "id_search",
  "query",
  "service_due_dates"
];

export const PRIMARY_FILTERS = [
  "sex",
  "age",
  "risk_level",
  "approval_status_case_plan",
  "last_updated_at"
];

export const DEFAULT_FILTERS = [
  "fields",
  "status",
  "record_state",
  "id_search"
];

export const OR_FIELDS = ["owned_by", "assigned_user_names"];

export const MY_CASES_FILTER_NAME = "my_cases";

export const OR_FILTER_NAME = "or";
