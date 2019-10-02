import * as Actions from "./actions";

export const fetchReport = id => async dispatch => {
  dispatch({
    type: Actions.FETCH_REPORT,
    api: {
      path: `reports/${id}`
    }
  });
};
