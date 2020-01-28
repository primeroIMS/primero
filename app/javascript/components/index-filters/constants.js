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
  "fields",
  "id_search",
  "query",
  "approval_status_bia",
  "approval_status_closure"
];

export const PRIMARY_FILTERS = [
  "sex",
  "age",
  "risk_level",
  "approval_status_case_plan",
  "last_updated_at"
];

export const OR_FIELDS = ["owned_by", "assigned_user_names"];

export const MY_CASES_FILTER_NAME = "my_cases";

export const OR_FILTER_NAME = "or";
