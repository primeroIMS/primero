import { fetchForms, fetchOptions } from "components/record-form";
import { batch } from "react-redux";
import { DB } from "config";
import * as Actions from "./actions";

export const fetchSystemSettings = () => async dispatch => {
  dispatch({
    type: Actions.FETCH_SYSTEM_SETTINGS,
    api: {
      path: "system_settings",
      params: { extended: true },
      db: {
        collection: DB.SYSTEM_SETTINGS
      }
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

export const setUserIdle = payload => {
  return {
    type: Actions.SET_USER_IDLE,
    payload
  };
};

export const setNetworkStatus = payload => {
  return {
    type: Actions.NETWORK_STATUS,
    payload
  };
};
