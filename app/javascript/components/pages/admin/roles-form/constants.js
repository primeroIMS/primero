export const NAME = "RolesForm";
export const FORM_CHECK_ERRORS = ["permissions"];
export const FIELD_NAMES = {
  name: "name",
  description: "description",
  transfer: "transfer",
  referral: "referral",
  moduleIds: "module_unique_ids",
  groupPermission: "group_permission",
  isManager: "is_manager",
  reportingLocationLevel: "reporting_location_level",
  disabled: "disabled"
};
export const ACTION_BUTTONS_NAME = "ActionButtons";

export const RESOURCES = [
  "case",
  "incident",
  "tracing_request",
  "potential_match",
  "role",
  "user",
  "user_group",
  "agency",
  "webhook",
  "metadata",
  "system",
  "primero_configuration",
  "report",
  "dashboard",
  "audit_log",
  "matching_configuration",
  "duplicate",
  "kpi"
];

export const ROLES_PERMISSIONS = Object.freeze({
  hide: Object.freeze({ id: "h", text: "hide" }),
  read: Object.freeze({ id: "r", text: "read" }),
  read_write: Object.freeze({ id: "rw", text: "read_write" })
});

export const FORM_ID = "role-form";
