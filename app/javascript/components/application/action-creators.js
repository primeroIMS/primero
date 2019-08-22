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
