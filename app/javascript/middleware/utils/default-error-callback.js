import { ENQUEUE_SNACKBAR, SNACKBAR_VARIANTS } from "../../components/notifier";
import { SET_DIALOG_PENDING } from "../../components/record-actions/actions";
import { getShortIdFromUniqueId } from "../../components/records/utils";

import handleRestCallback from "./handle-rest-callback";

export default (store, response, json, recordType = null, fromQueue = false, id = null) => {
  const messages = fromQueue
    ? `sync.error.${id ? "update" : "create"}`
    : json?.errors?.map(error => error.message).join(", ");
  const errorPayload = [
    {
      action: ENQUEUE_SNACKBAR,
      payload: {
        messageKey: messages || "errors.api.internal_server",
        messageParams: fromQueue ? { short_id: getShortIdFromUniqueId(id) } : {},
        recordType,
        options: {
          variant: SNACKBAR_VARIANTS.error,
          key: fromQueue ? `record_sync_error_${id || "create"}` : "internal_server"
        }
      }
    },
    {
      action: SET_DIALOG_PENDING,
      payload: {
        pending: false
      }
    }
  ];

  if (response.status !== 401) {
    handleRestCallback(store, errorPayload, response, json);
  }
};
