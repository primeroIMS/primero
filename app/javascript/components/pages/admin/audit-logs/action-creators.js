import { RECORD_PATH } from "../../../../config";
import { compactFilters } from "../../../index-filters/utils";

import actions from "./actions";

export const fetchAuditLogs = params => {
  const { options } = params;

  return {
    type: actions.FETCH_AUDIT_LOGS,
    api: {
      path: RECORD_PATH.audit_logs,
      params: compactFilters(options || {})
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
