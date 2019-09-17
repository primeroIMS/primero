import { ENQUEUE_SNACKBAR } from "components/notifier";
import * as Actions from "./actions";

export const setReopen = (id, body, message, recordType) => async dispatch => {
  await dispatch({
    type: Actions.SET_REOPEN,
    api: {
      path: `/${recordType}/${id}`,
      method: "PATCH",
      body,
      successCallback: {
        action: ENQUEUE_SNACKBAR,
        payload: {
          message,
          options: {
            variant: "success",
            key: new Date().getTime() + Math.random()
          }
        }
      }
    }
  });
};
