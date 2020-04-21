import { RECORD_PATH } from "../../../../config";

import actions from "./actions";

export const fetchAuditLogs = params => {
  const { data } = params;

  return {
    type: actions.FETCH_AUDIT_LOGS,
    api: {
      path: RECORD_PATH.audit_logs,
      params: data || {}
    }
  };
};

export const fetchPerformedBy = () => ({
  type: actions.FETCH_PERFORMED_BY,
  api: {
    path: RECORD_PATH.users,
    params: { per: 999 }
  }
});

export const setAuditLogsFilters = payload => ({
  type: actions.SET_AUDIT_LOGS_FILTER,
  payload
});
