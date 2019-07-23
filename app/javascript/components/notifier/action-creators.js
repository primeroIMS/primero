import * as Actions from "./actions";

export const enqueueSnackbar = (message, type) => {
  return {
    type: Actions.ENQUEUE_SNACKBAR,
    payload: {
      message,
      options: {
        key: new Date().getTime() + Math.random(),
        variant: type || "info"
      }
    }
  };
};

export const closeSnackbar = key => ({
  type: Actions.CLOSE_SNACKBAR,
  payload: {
    key
  }
});

export const removeSnackbar = key => ({
  type: Actions.REMOVE_SNACKBAR,
  payload: {
    key
  }
});
