/* eslint-disable import/prefer-default-export */
import { fromJS, Map } from "immutable";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({});

const flags = [
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
];

const casesByStatus = {
  open: "2660451",
  closed: "1547"
};

const chartInnerText = [
  { text: `${casesByStatus.open} Open`, bold: true },
  { text: `${casesByStatus.closed} Closed` }
];

const casesByCaseWorker = {
  results: [
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
};

const casesRegistration = {
  jan: 150,
  feb: 100,
  mar: 50,
  apr: 120,
  may: 200,
  jun: 100,
  jul: 80,
  aug: 50,
  sep: 120
};

const reducer = (state = DEFAULT_STATE, { type }) => {
  switch (type) {
    case Actions.DASHBOARD_FLAGS:
      return state.set("flags", fromJS(flags));
    case Actions.CASES_BY_STATUS:
      return state
        .set("casesByStatus", fromJS(casesByStatus))
        .set("chartInnerText", fromJS(chartInnerText));
    case Actions.CASES_BY_CASE_WORKER:
      return state.set("casesByCaseWorker", fromJS(casesByCaseWorker));
    case Actions.CASES_REGISTRATION:
      return state.set("casesRegistration", fromJS(casesRegistration));
    default:
      return state;
  }
};

export const dashboardReducers = { [NAMESPACE]: reducer };
