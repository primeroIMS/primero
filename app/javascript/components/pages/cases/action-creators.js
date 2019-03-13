import * as Actions from "./actions";
import { getCases } from "./services";

export const requestCases = () => {
  return {
    type: Actions.REQUEST_CASES
  };
};

export const setPagination = payload => {
  return {
    type: Actions.SET_PAGINATION,
    payload
  };
};

export const setFilters = payload => {
  return {
    type: Actions.SET_FILTERS,
    payload
  };
};

export const recieveCases = payload => {
  return {
    type: Actions.RECEIVE_CASES,
    payload
  };
};

export const fetchCases = options => async dispatch => {
  dispatch(setFilters(options));
  dispatch(requestCases());

  const json = await getCases({ params: options });
  dispatch(setPagination(json.meta));
  dispatch(recieveCases(json.results));
};
