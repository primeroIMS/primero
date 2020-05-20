import { RECORD_PATH } from "../../../config";
import { DB_COLLECTIONS_NAMES } from "../../../db";

import {
  DASHBOARD_FLAGS,
  CASES_BY_STATUS,
  CASES_BY_CASE_WORKER,
  CASES_REGISTRATION,
  CASES_OVERVIEW,
  DASHBOARDS,
  SERVICES_STATUS,
  OPEN_PAGE_ACTIONS
} from "./actions";

export const fetchFlags = () => {
  return {
    type: DASHBOARD_FLAGS,
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
  };
};

export const fetchCasesByStatus = () => {
  return {
    type: CASES_BY_STATUS,
    payload: {
      casesByStatus: {
        open: "100",
        closed: "100"
      }
    }
  };
};

export const fetchCasesByCaseWorker = () => {
  return {
    type: CASES_BY_CASE_WORKER,
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
  };
};

export const fetchCasesRegistration = () => {
  return {
    type: CASES_REGISTRATION,
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
  };
};

export const fetchCasesOverview = () => {
  return {
    type: CASES_OVERVIEW,
    payload: {
      casesOverview: {
        transfers: 4,
        waiting: 1,
        pending: 1,
        rejected: 1
      }
    }
  };
};

export const fetchServicesStatus = () => {
  return {
    type: SERVICES_STATUS,
    payload: {
      services: {
        caseManagement: [
          { status: "in_progress", high: 4, medium: 0, low: 1 },
          { status: "near_deadline", high: 1, medium: 0, low: 0 },
          { status: "overdue", high: 1, medium: 0, low: 1 }
        ],
        screening: [
          { status: "in_progress", high: 4, medium: 0, low: 1 },
          { status: "near_deadline", high: 1, medium: 0, low: 0 },
          { status: "overdue", high: 1, medium: 0, low: 1 }
        ]
      }
    }
  };
};

export const openPageActions = payload => {
  return {
    type: OPEN_PAGE_ACTIONS,
    payload
  };
};

export const fetchDashboards = () => ({
  type: DASHBOARDS,
  api: {
    path: RECORD_PATH.dashboards,
    db: {
      collection: DB_COLLECTIONS_NAMES.DASHBOARDS
    }
  }
});
