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

export const fetchReportingDelay = () => async dispatch => {
  dispatch({
    type: Actions.REPORTING_DELAY_SUCCESS,
    //    api: {
    //      path: "key_performance_indicators/number_of_cases"
    //    },
    payload: {
      columns: ["Delay", "Total Cases", ""],
      data: [
        ["0-3 days", 123, 0.395],
        ["4-5 days", 56, 0.1],
        ["6-14 days", 120, 0.395],
        ["15-30 days", 48, 0.1],
        ["1-3 months", 4, 0.01],
        ["3 months +", 0, 0.0],
      ]
    }
  });
};
