import * as Actions from "./actions";

export const fetchModules = () => async dispatch => {
  dispatch({
    type: Actions.FETCH_MODULES,
    api: {
      path: "system_settings",
      params: { extended: true }
    }
  });
};
