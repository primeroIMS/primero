import * as Actions from "./actions";

export const setFilters = payload => {
  return {
    type: Actions.SET_FILTERS,
    payload
  };
};

export const fetchCases = options => async dispatch => {
  dispatch(setFilters(options));

  dispatch({
    type: "CASES",
    api: {
      path: "/cases",
      params: options
    }
  });
};
