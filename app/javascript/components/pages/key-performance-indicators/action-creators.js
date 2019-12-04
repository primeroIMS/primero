import * as Actions from "./actions";

export const fetchNumberOfCases = () => async dispatch => {
  dispatch({
    type: Actions.NUMBER_OF_CASES_SUCCESS,
    //    api: {
    //      path: "key_performance_indicators/number_of_cases"
    //    },
    payload: {
      dates: ["Sep 2019", "Aug 2019", "Jul 2019"],
      // TODO: Decide on data format for this, something coherent and easy to
      //       understand but which minimized frontend processing.
      data: [
        {
          "reporting_site": "Site #1",
          "Sep 2019": 2,
          "Aug 2019": 1,
          "Jul 2019": 0
        },
        {
          "reporting_site": "Site #2",
          "Sep 2019": 2,
          "Aug 2019": 1,
          "Jul 2019": 0
        },
        {
          "reporting_site": "Site #3",
          "Sep 2019": 2,
          "Aug 2019": 1,
          "Jul 2019": 0
        }
      ]
    }
  });
};

export const fetchNumberOfIncidents = () => async dispatch => {
  dispatch({
    type: Actions.NUMBER_OF_INCIDENTS_SUCCESS,
    //    api: {
    //      path: "key_performance_indicators/number_of_incidents"
    //    },
    payload: {
      dates: ["Sep 2019", "Aug 2019", "Jul 2019"],
      data: [
        {
          "reporting_site": "Site #1",
          "Sep 2019": 2,
          "Aug 2019": 1,
          "Jul 2019": 0
        },
        {
          "reporting_site": "Site #2",
          "Sep 2019": 2,
          "Aug 2019": 1,
          "Jul 2019": 0
        },
        {
          "reporting_site": "Site #3",
          "Sep 2019": 2,
          "Aug 2019": 1,
          "Jul 2019": 0
        }
      ]
    }
  });
};

export const fetchReportingDelay = () => async dispatch => {
  dispatch({
    type: Actions.REPORTING_DELAY_SUCCESS,
    //    api: {
    //      path: "key_performance_indicators/reporting_delay"
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
