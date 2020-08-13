import { ENQUEUE_SNACKBAR, CLOSE_SNACKBAR, REMOVE_SNACKBAR } from "./actions";
import { generate } from "./utils";
import { SNACKBAR_VARIANTS } from "./constants";

export const enqueueSnackbar = (message, config = {}) => {
  const { type, messageKey, ...rest } = config;

  return {
    type: ENQUEUE_SNACKBAR,
    payload: {
      message,
      messageKey,
      options: {
        key: generate.messageKey(message || messageKey, Boolean(messageKey)),
        variant: type || SNACKBAR_VARIANTS.info,
        ...rest
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
