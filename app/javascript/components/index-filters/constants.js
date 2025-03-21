// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export const FILTER_TYPES = Object.freeze({
  CHECKBOX: "checkbox",
  SELECT: "select",
  MULTI_SELECT: "multi_select",
  MULTI_TOGGLE: "multi_toggle",
  CHIPS: "chips",
  TOGGLE: "toggle",
  DATES: "dates",
  WORKFLOW: "workflow"
});

export const ID_SEARCH = "id_search";

export const HIDDEN_FIELDS = [
  "approval_status_assessment",
  "approval_status_closure",
  "assessment_due_dates",
  "associated_user_names",
  "case_plan_due_dates",
  "fields",
  "followup_due_dates",
  ID_SEARCH,
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

export const VIOLATIONS_FILTER_NAMES = Object.freeze([
  "weapon_type",
  "facility_impact",
  "facility_attack_type",
  "child_role",
  "abduction_purpose_single",
  "military_use_type",
  "types_of_aid_disrupted_denial"
]);

export const PRIMARY_FILTERS = ["sex", "gender", "age", "risk_level", "approval_status_case_plan", "last_updated_at"];

export const DEFAULT_FILTERS = ["fields", "status", "record_state", ID_SEARCH];

export const OR_FIELDS = ["owned_by", "assigned_user_names"];

export const MY_CASES_FILTER_NAME = "my_cases";

export const OR_FILTER_NAME = "or";
export const DEFAULT_SELECTED_RECORDS_VALUE = {};

export const FILTER_CATEGORY = Object.freeze({
  incidents: "incidents",
  individual_victims: "individual_victims",
  violations: "violations"
});
