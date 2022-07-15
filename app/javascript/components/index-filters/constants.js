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
  "approval_status_assessment",
  "approval_status_closure",
  "assessment_due_dates",
  "associated_user_names",
  "case_plan_due_dates",
  "fields",
  "followup_due_dates",
  "id_search",
  "not_edited_by_owner",
  "query",
  "referred_users",
  "referred_users_present",
  "service_due_dates",
  "transferred_to_users",
  "has_incidents"
];

export const INDIVIDUAL_VICTIM_FILTER_NAMES = Object.freeze([
  "individual_violations",
  "individual_age",
  "individual_sex",
  "victim_deprived_liberty_security_reasons",
  "reasons_deprivation_liberty",
  "victim_facilty_victims_held",
  "torture_punishment_while_deprivated_liberty"
]);

export const PRIMARY_FILTERS = {
  cases: ["sex", "age", "risk_level", "approval_status_case_plan", "last_updated_at"],
  incidents: [
    "age",
    "flagged",
    "incident_location2",
    "violation_category",
    "child_types",
    "verification_status",
    "verified_ghn_reported",
    "incident_location",
    "incidents_by_date",
    "armed_force_group_party_names",
    ...INDIVIDUAL_VICTIM_FILTER_NAMES
  ]
};

export const DEFAULT_FILTERS = ["fields", "status", "record_state", "id_search"];

export const OR_FIELDS = ["owned_by", "assigned_user_names"];

export const MY_CASES_FILTER_NAME = "my_cases";

export const OR_FILTER_NAME = "or";
export const DEFAULT_SELECTED_RECORDS_VALUE = {};

export const FILTER_CATEGORY = Object.freeze({
  incidents: "incidents",
  individual_victims: "individual_victims"
});
