import { DB } from "config";
import { fetchForms, fetchOptions } from "components/record-form";
import Actions from "./actions";

export const fetchSystemSettings = () => async dispatch => {
  return dispatch({
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
  return Promise.all([
    dispatch(fetchSystemSettings()),
    dispatch(fetchForms()),
    dispatch(fetchOptions())
  ]);
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
