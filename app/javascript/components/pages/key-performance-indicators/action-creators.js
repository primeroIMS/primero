import * as Actions from "./actions";

export const fetchNumberOfCases = () => async dispatch => {
  dispatch({
    type: Actions.NUMBER_OF_CASES_SUCCESS,
    //    api: {
    //      path: "key_performance_indicators/number_of_cases"
    //    },
    payload: {
      columns: ["REPORTING SITE", "SEP 2019", "AUG 2019", "JUL 2019"],
      data: [["Site #1", 2, 1, 0], ["Site #2", 2, 1, 0], ["Site #3", 2, 1, 0]]
    }
  });
};
