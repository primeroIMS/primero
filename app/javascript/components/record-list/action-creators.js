import * as Actions from "./actions";

const setFilters = payload => {
  return {
    type: Actions.SET_FILTERS,
    payload
  };
};

const fetchRecords = data => async dispatch => {
  console.log("hrereere");
  dispatch(setFilters(data.options));

  dispatch({
    type: "RECORDS",
    api: {
      path: data.path,
      params: data.options
    }
  });
};

export default {
  setFilters,
  fetchRecords
};
