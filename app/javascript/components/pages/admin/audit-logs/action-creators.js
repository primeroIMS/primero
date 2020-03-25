import { RECORD_PATH } from "../../../../config";
import { compactFilters } from "../../../index-filters/utils";

import actions from "./actions";

export const fetchAuditLogs = params => {
  console.log("TO SEND", compactFilters(params));

  return {
    type: actions.FETCH_AUDIT_LOGS,
    payload: {
      data: [
        {
          id: 2,
          display_id: "",
          record_type: "AuditLog",
          user_name: "primero",
          action: "index",
          resource_url: "http://localhost:3000/api/v2/audit_logs",
          timestamp: "2020-03-03T16:40:39.387Z",
          log_message: "Listing Records AuditLog '' by user 'primero'",
          metadata: {
            user_name: "primero"
          }
        },
        {
          id: 1,
          display_id: 1,
          record_type: "User",
          user_name: "primero",
          action: "create",
          resource_url: "http://localhost:3000/api/v2/tokens",
          timestamp: "2020-03-03T16:40:37.370Z",
          log_message: "Creating User '1' by user 'primero'",
          metadata: {
            user_name: "primero"
          }
        }
      ],
      metadata: {
        total: 2,
        per: 100,
        page: 1
      }
    }
    // api: {
    //   path: RECORD_PATH.audit_logs,
    //   params: data
    // }
  };
};
