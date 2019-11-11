import { batch } from "react-redux";

import { DB } from "../../config";
import { fetchForms, fetchOptions } from "../record-form";

import actions from "./actions";

export const fetchSystemSettings = () => ({
  type: actions.FETCH_SYSTEM_SETTINGS,
  api: {
    path: "system_settings",
    params: { extended: true },
    db: {
      collection: DB.SYSTEM_SETTINGS
    }
  }
});

export const loadApplicationResources = () => async dispatch => {
  batch(() => {
    dispatch(fetchSystemSettings());
    dispatch(fetchForms());
    dispatch(fetchOptions());
  });
};

export const setUserIdle = payload => ({
  type: actions.SET_USER_IDLE,
  payload
});

export const setNetworkStatus = payload => ({
  type: actions.NETWORK_STATUS,
  payload
});
