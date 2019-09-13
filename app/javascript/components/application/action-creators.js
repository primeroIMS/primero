import { fetchForms, fetchOptions } from "components/record-form";
import { batch } from "react-redux";
import * as Actions from "./actions";

export const fetchSystemSettings = () => async dispatch => {
  dispatch({
    type: Actions.FETCH_SYSTEM_SETTINGS,
    api: {
      path: "system_settings",
      params: { extended: true }
    }
  });
};

export const loadApplicationResources = () => async dispatch => {
  batch(() => {
    dispatch(fetchSystemSettings());
    dispatch(fetchForms());
    dispatch(fetchOptions());
  });
};
