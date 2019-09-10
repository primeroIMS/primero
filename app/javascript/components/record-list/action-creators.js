import { cleanUpFilters } from "./helpers";

export const fetchRecords = data => async dispatch => {
  dispatch({
    type: `${data.recordType}/SET_FILTERS`,
    payload: data.options
  });

  dispatch({
    type: `${data.recordType}/RECORDS`,
    api: {
      path: data.recordType,
      params: cleanUpFilters(data.options)
    }
  });
};
