import * as Actions from "./actions";

export const fetchNumberOfCases = () => async dispatch => {
  dispatch({
    type: Actions.NUMBER_OF_CASES,
    api: {
      path: "key_performance_indicators/number_of_cases"
    }
  });
};

export const fetchNumberOfIncidents = () => async dispatch => {
  dispatch({
    type: Actions.NUMBER_OF_INCIDENTS,
    api: {
      path: "key_performance_indicators/number_of_incidents"
    }
  });
};

export const fetchReportingDelay = () => async dispatch => {
  dispatch({
    type: Actions.REPORTING_DELAY,
    api: {
      path: "key_performance_indicators/reporting_delay"
    },
    payload: {
      data: [
        { delay: "0-3 days", total_cases: 123, percentage: 0.395 },
        { delay: "4-5 days", total_cases: 56, percentage: 0.1 },
        { delay: "6-14 days", total_cases: 120, percentage: 0.395 },
        { delay: "15-30 days", total_cases: 48, percentage: 0.1 },
        { delay: "1-3 months", total_cases: 4, percentage: 0.01 },
        { delay: "3 months +", total_cases: 0, percentage: 0.0 },
      ]
    }
  });
};

export const fetchServiceAccessDelay = () => async dispatch => {
  dispatch({
    type: Actions.SERVICE_ACCESS_DELAY_SUCCESS,
    //    api: {
    //      path: "key_performance_indicators/service_access_delay"
    //    },
    payload: {
      data: [
        { delay: "0-3 days", total_cases: 123, percentage: 0.395 },
        { delay: "4-5 days", total_cases: 56, percentage: 0.1 },
        { delay: "6-14 days", total_cases: 120, percentage: 0.395 },
        { delay: "15-30 days", total_cases: 48, percentage: 0.1 },
        { delay: "1-3 months", total_cases: 4, percentage: 0.01 },
        { delay: "3 months +", total_cases: 0, percentage: 0.0 },
      ]
    }
  });
};
