import kebabCase from "lodash/kebabCase";

import { ENQUEUE_SNACKBAR, CLOSE_SNACKBAR, REMOVE_SNACKBAR } from "./actions";
import { generate } from "./utils";
import { SNACKBAR_VARIANTS } from "./constants";

export const enqueueSnackbar = (message, type) => {
  return {
    type: ENQUEUE_SNACKBAR,
    payload: {
      message,
      options: {
        key: message ? kebabCase(message) : generate.messageKey(),
        variant: type || SNACKBAR_VARIANTS.info
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
