import * as Actions from "./actions";

export const fetchAgencyLogo = () => async dispatch => {
  dispatch({
    type: Actions.FETCH_AGENCY_LOGO,
    api: {
      path: "system_settings",
      params: { extended: true }
    }
  });
};
