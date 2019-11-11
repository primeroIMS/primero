import { cleanUpFilters } from "../../records/helpers";

import * as Actions from "./actions";

export const fetchReports = data => async dispatch => {
  dispatch({
    type: Actions.FETCH_REPORTS,
    api: {
      path: "reports",
      params: cleanUpFilters(data.options)
    }
  });
};
