import { ENQUEUE_SNACKBAR, SNACKBAR_VARIANTS } from "../../components/notifier";
import { getShortIdFromUniqueId } from "../../components/records/utils";
import { SET_DIALOG_PENDING } from "../../components/action-dialog";

import handleRestCallback from "./handle-rest-callback";

export default ({ store, response = {}, json = {}, recordType = null, fromQueue = false, id = null, error }) => {
  const messages = fromQueue
    ? `sync.error.${id ? "update" : "create"}`
    : json?.errors?.map(err => err.message).join(", ");

  const errorPayload = [
    {
      action: ENQUEUE_SNACKBAR,
      payload: {
        messageKey: messages || "errors.api.internal_server",
        messageDetailed: response?.message || error?.message,
        ...(fromQueue && id ? { messageParams: { short_id: getShortIdFromUniqueId(id) } } : {}),
        ...(recordType ? { recordType } : {}),
        options: {
          variant: SNACKBAR_VARIANTS.error,
          key: fromQueue ? `record_sync_error_${id || "create"}` : "internal_server"
        }
      }
    },
    {
      action: SET_DIALOG_PENDING,
      payload: false
    }
  ];

  if (response.status !== 401) {
    handleRestCallback(store, errorPayload, response, json);
  }
};
