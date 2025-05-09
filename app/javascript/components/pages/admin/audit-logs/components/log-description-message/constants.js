// Copyright (c) 2014 UNICEF. All rights reserved.

import { ROUTES } from "../../../../../../config";

export const ACTIONS_WITH_RECORD_ID = Object.freeze(["show", "show_alerts", "update"]);
export const AUDIT_LOGS_PATHS = Object.freeze({
  case: ROUTES.cases,
  child: ROUTES.cases,
  incident: ROUTES.incident,
  tracing_request: ROUTES.tracing_request,
  user: ROUTES.admin_users,
  role: ROUTES.admin_roles,
  agency: ROUTES.admin_roles,
  user_group: ROUTES.admin_roles,
  report: ROUTES.reports
});
