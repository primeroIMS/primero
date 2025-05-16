// Copyright (c) 2014 UNICEF. All rights reserved.

import { ROUTES } from "../../../../../../config";

export const ACTIONS_WITH_RECORD_ID = Object.freeze([
  "show",
  "show_alerts",
  "update",
  "assessment_approved",
  "assessment_requested",
  "assessment_rejected",
  "enable_disable_record",
  "flag",
  "unflag",
  "open",
  "reopen",
  "close",
  "attach",
  "detach",
  "add_note",
  "case_plan_approved",
  "case_plan_requested",
  "case_plan_rejected",
  "assign",
  "transfer_accepted",
  "transfer_rejected",
  "transfer_request",
  "transfer_revoked",
  "closure_approved",
  "closure_rejected",
  "closure_requested",
  "incident_details_from_case",
  "refer",
  "refer_accepted",
  "refer_done",
  "refer_rejected",
  "refer_revoke",
  "create_family",
  "traces",
  "transfer"
]);

export const AUDIT_LOGS_PATHS = Object.freeze({
  case: ROUTES.cases,
  child: ROUTES.cases,
  incident: ROUTES.incidents,
  tracing_request: ROUTES.tracing_requests,
  user: ROUTES.admin_users,
  role: ROUTES.admin_roles,
  agency: ROUTES.admin_agencies,
  user_group: ROUTES.admin_user_groups,
  report: ROUTES.reports,
  managed_report: ROUTES.insights
});
