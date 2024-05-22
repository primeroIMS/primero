// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { RECORD_PATH } from "../../../config";
import { DB_COLLECTIONS_NAMES } from "../../../db";

import actions from "./actions";

export const fetchFlags = (recordType, activeOnly = false) => {
  const commonPath = `record_type=${recordType}`;
  const path = activeOnly
    ? `${RECORD_PATH.flags}?active_only=true&${commonPath}`
    : `${RECORD_PATH.flags}?${commonPath}`;

  return {
    type: actions.DASHBOARD_FLAGS,
    api: {
      path
    }
  };
};

export const fetchCasesByStatus = () => {
  return {
    type: actions.CASES_BY_STATUS,
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
    type: actions.CASES_BY_CASE_WORKER,
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
    type: actions.CASES_REGISTRATION,
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
    type: actions.CASES_OVERVIEW,
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
    type: actions.SERVICES_STATUS,
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
    type: actions.OPEN_PAGE_ACTIONS,
    payload
  };
};

export const fetchDashboards = () => ({
  type: actions.DASHBOARDS,
  api: {
    path: RECORD_PATH.dashboards,
    db: {
      collection: DB_COLLECTIONS_NAMES.DASHBOARDS
    }
  }
});
