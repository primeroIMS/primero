import * as Actions from "./actions";

export const fetchNumberOfCases = () => async dispatch => {
  dispatch({
    type: Actions.NUMBER_OF_CASES,
    api: {
      path: "key_performance_indicators/number_of_cases"
    }
  });
};
