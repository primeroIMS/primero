// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { RECORD_PATH } from "../../../config";
import { DB_COLLECTIONS_NAMES } from "../../../db";

import actions from "./actions";
import { DASHBOARD_GROUP, DASHBOARD_NAMES_FOR_GROUP } from "./constants";

export const fetchFlags = (recordType, activeOnly = false) => {
  const commonPath = `record_type=${recordType}&per=10`;
  const path = activeOnly
    ? `${RECORD_PATH.flags}?active_only=true&${commonPath}`
    : `${RECORD_PATH.flags}?${commonPath}`;

  return {
    type: actions.DASHBOARD_FLAGS,
    api: {
      path,
      db: {
        collection: DB_COLLECTIONS_NAMES.DASHBOARDS,
        group: DASHBOARD_GROUP.flags
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

export const fetchDashboards = ({ group }) => ({
  type: actions[`DASHBOARD_${group.toUpperCase()}`],
  api: {
    path: RECORD_PATH.dashboards,
    params: { names: DASHBOARD_NAMES_FOR_GROUP[group] },
    db: {
      collection: DB_COLLECTIONS_NAMES.DASHBOARDS,
      group
    }
  }
});

export const fetchDashboardApprovals = primeroModules => ({
  type: actions.DASHBOARD_APPROVALS,
  api: {
    path: RECORD_PATH.dashboards,
    params: {
      names: DASHBOARD_NAMES_FOR_GROUP.approvals.flatMap(approval =>
        primeroModules.reduce((acc, primeroModule) => {
          acc.push(`${approval}.${primeroModule}`);

          return acc;
        }, [])
      )
    },
    db: {
      collection: DB_COLLECTIONS_NAMES.DASHBOARDS,
      group: DASHBOARD_GROUP.approvals
    }
  }
});
