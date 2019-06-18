import * as Actions from "./actions";

export const fetchFlags = () => async dispatch => {
  dispatch({
    type: Actions.DASHBOARD_FLAGS,
    payload: {
      flags: [
        {
          id: "#1234",
          flag_date: "01/01/2019",
          user: "CP Admin",
          status: "Please check approval"
        },
        {
          id: "#1235",
          flag_date: "01/01/2019",
          user: "CP Manager",
          status: "To followup"
        },
        {
          id: "#1236",
          flag_date: "01/01/2019",
          user: "CP CaseWorker",
          status: "To followup"
        }
      ],
      totalCount: 10
    }
  });
};

export const fetchCasesByStatus = () => async dispatch => {
  dispatch({
    type: Actions.CASES_BY_STATUS,
    payload: {
      casesByStatus: {
        open: "100",
        closed: "100"
      }
    }
  });
};

export const fetchCasesByCaseWorker = () => async dispatch => {
  dispatch({
    type: Actions.CASES_BY_CASE_WORKER,
    payload: {
      casesByCaseWorker: [
        {
          case_worker: "Case Worker 1",
          assessment: "2",
          case_plan: "1",
          follow_up: "0",
          services: "1"
        },
        {
          case_worker: "Case Worker 2",
          assessment: "2",
          case_plan: "1",
          follow_up: "0",
          services: "1"
        }
      ]
    }
  });
};

export const fetchCasesRegistration = () => async dispatch => {
  dispatch({
    type: Actions.CASES_REGISTRATION,
    payload: {
      casesRegistration: {
        jan: 150,
        feb: 100,
        mar: 50,
        apr: 120,
        may: 200,
        jun: 100,
        jul: 80,
        aug: 50,
        sep: 120
      }
    }
  });
};

export const fetchCasesOverview = () => async dispatch => {
  dispatch({
    type: Actions.CASES_OVERVIEW,
    payload: {
      casesOverview: {
        transfers: 4,
        waiting: 1,
        pending: 1,
        rejected: 1
      }
    }
  });
};

export const openPageActions = payload => {
  return {
    type: Actions.OPEN_PAGE_ACTIONS,
    payload
  };
};
