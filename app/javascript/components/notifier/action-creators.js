import { ENQUEUE_SNACKBAR, CLOSE_SNACKBAR, REMOVE_SNACKBAR } from "./actions";
import { generate } from "./utils";

export const enqueueSnackbar = (message, type) => {
  return {
    type: ENQUEUE_SNACKBAR,
    payload: {
      message,
      options: {
        key: generate.messageKey(),
        variant: type || "info"
      }
    }
  };
};

export const closeSnackbar = key => ({
  type: CLOSE_SNACKBAR,
  payload: {
    key
  }
});

export const removeSnackbar = key => ({
  type: REMOVE_SNACKBAR,
  payload: {
    key
  }
});
