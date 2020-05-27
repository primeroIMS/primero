import { ENQUEUE_SNACKBAR, SNACKBAR_VARIANTS } from "../../components/notifier";
import { SET_DIALOG_PENDING } from "../../components/record-actions/actions";

import handleRestCallback from "./handle-rest-callback";

export default (store, response, json) => {
  const messages = json?.errors?.map(error => error.message).join(", ");
  const errorPayload = [
    {
      action: ENQUEUE_SNACKBAR,
      payload: {
        messageKey: messages || "errors.api.internal_server",
        options: {
          variant: SNACKBAR_VARIANTS.error,
          key: "internal_server"
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
