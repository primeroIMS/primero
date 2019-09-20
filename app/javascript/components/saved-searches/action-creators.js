import { ENQUEUE_SNACKBAR } from "components/notifier";
import * as Actions from "./actions";

export const fetchSavedSearches = () => async dispatch => {
  dispatch({
    type: Actions.FETCH_SAVED_SEARCHES,
    api: {
      path: `/saved_searches`
    }
  });
};

export const removeSavedSearch = (id, message) => dispatch => {
  dispatch({
    type: Actions.REMOVE_SAVED_SEARCH,
    api: {
      path: `/saved_searches/${id}`,
      method: "DELETE",
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
