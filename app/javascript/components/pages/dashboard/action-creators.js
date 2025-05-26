// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { RECORD_PATH } from "../../../config";
import { DB_COLLECTIONS_NAMES } from "../../../db";

import actions from "./actions";
import { DASHBOARD_GROUP, DASHBOARD_GROUP_NAMES } from "./constants";

export const fetchFlags = (recordType, activeOnly = false) => {
  const commonPath = `record_type=${recordType}`;
  const path = activeOnly
    ? `${RECORD_PATH.flags}?active_only=true&${commonPath}`
    : `${RECORD_PATH.flags}?${commonPath}`;

  return {
    type: actions.DASHBOARD_FLAGS,
    api: {
      path,
      db: {
        collection: DB_COLLECTIONS_NAMES.DASHBOARDS,
        groupName: DASHBOARD_GROUP.flags
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

export const fetchDashboardOvierview = () => ({
  type: actions.DASHBOARD_OVERVIEW,
  api: {
    path: RECORD_PATH.dashboards,
    params: { names: DASHBOARD_GROUP_NAMES.overview },
    db: {
      collection: DB_COLLECTIONS_NAMES.DASHBOARDS,
      groupName: DASHBOARD_GROUP.overview
    }
  }
});

export const fetchDashboardActionNeeded = () => ({
  type: actions.DASHBOARD_ACTION_NEEDED,
  api: {
    path: RECORD_PATH.dashboards,
    params: { names: DASHBOARD_GROUP_NAMES.action_needed },
    db: {
      collection: DB_COLLECTIONS_NAMES.DASHBOARDS,
      groupName: DASHBOARD_GROUP.action_needed
    }
  }
});

export const fetchDashboardWorkflow = () => ({
  type: actions.DASHBOARD_WORKFLOW,
  api: {
    path: RECORD_PATH.dashboards,
    params: { names: DASHBOARD_GROUP_NAMES.workflow },
    db: {
      collection: DB_COLLECTIONS_NAMES.DASHBOARDS,
      groupName: DASHBOARD_GROUP.workflow
    }
  }
});

export const fetchDashboardApprovals = primeroModules => ({
  type: actions.DASHBOARD_APPROVALS,
  api: {
    path: RECORD_PATH.dashboards,
    params: {
      names: DASHBOARD_GROUP_NAMES.approvals.flatMap(approval =>
        primeroModules.reduce((acc, primeroModule) => {
          acc.push(`${approval}.${primeroModule}`);

          return acc;
        }, [])
      )
    },
    db: {
      collection: DB_COLLECTIONS_NAMES.DASHBOARDS,
      groupName: DASHBOARD_GROUP.approvals
    }
  }
});

export const fetchDashboardCasesToAssign = () => ({
  type: actions.DASHBOARD_CASES_TO_ASSIGN,
  api: {
    path: RECORD_PATH.dashboards,
    params: { names: DASHBOARD_GROUP_NAMES.cases_to_assign },
    db: {
      collection: DB_COLLECTIONS_NAMES.DASHBOARDS,
      groupName: DASHBOARD_GROUP.cases_to_assign
    }
  }
});

export const fetchReferralsTransfers = () => ({
  type: actions.DASHBOARD_REFERRALS_TRANSFERS,
  api: {
    path: RECORD_PATH.dashboards,
    params: { names: DASHBOARD_GROUP_NAMES.referrals_transfers },
    db: {
      collection: DB_COLLECTIONS_NAMES.DASHBOARDS,
      groupName: DASHBOARD_GROUP.referrals_transfers
    }
  }
});

export const fetchDashboardSharedFromMyTeam = () => ({
  type: actions.DASHBOARD_SHARED_FROM_MY_TEAM,
  api: {
    path: RECORD_PATH.dashboards,
    params: { names: DASHBOARD_GROUP_NAMES.shared_from_my_team },
    db: {
      collection: DB_COLLECTIONS_NAMES.DASHBOARDS,
      groupName: DASHBOARD_GROUP.shared_from_my_team
    }
  }
});

export const fetchDashboardSharedWithMyTeam = () => ({
  type: actions.DASHBOARD_SHARED_WITH_MY_TEAM,
  api: {
    path: RECORD_PATH.dashboards,
    params: { names: DASHBOARD_GROUP_NAMES.shared_with_my_team },
    db: {
      collection: DB_COLLECTIONS_NAMES.DASHBOARDS,
      groupName: DASHBOARD_GROUP.shared_with_my_team
    }
  }
});

export const fetchDashboardOverdueTasks = () => ({
  type: actions.DASHBOARD_OVERDUE_TASKS,
  api: {
    path: RECORD_PATH.dashboards,
    params: { names: DASHBOARD_GROUP_NAMES.overdue_tasks },
    db: {
      collection: DB_COLLECTIONS_NAMES.DASHBOARDS,
      groupName: DASHBOARD_GROUP.overdue_tasks
    }
  }
});

export const fetchDashboardCasesBySocialWorker = () => ({
  type: actions.DASHBOARD_CASES_BY_SOCIAL_WORKER,
  api: {
    path: RECORD_PATH.dashboards,
    params: { names: DASHBOARD_GROUP_NAMES.cases_by_social_worker },
    db: {
      collection: DB_COLLECTIONS_NAMES.DASHBOARDS,
      groupName: DASHBOARD_GROUP.cases_by_social_worker
    }
  }
});

export const fetchDashboardWorkflowTeam = () => ({
  type: actions.DASHBOARD_WORKFLOW_TEAM,
  api: {
    path: RECORD_PATH.dashboards,
    params: { names: DASHBOARD_GROUP_NAMES.workflow_team },
    db: {
      collection: DB_COLLECTIONS_NAMES.DASHBOARDS,
      groupName: DASHBOARD_GROUP.workflow_team
    }
  }
});

export const fetchDashboardReportingLocation = () => ({
  type: actions.DASHBOARD_REPORTING_LOCATION,
  api: {
    path: RECORD_PATH.dashboards,
    params: { names: DASHBOARD_GROUP_NAMES.reporting_location },
    db: {
      collection: DB_COLLECTIONS_NAMES.DASHBOARDS,
      groupName: DASHBOARD_GROUP.reporting_location
    }
  }
});

export const fetchDashboardProtectionConcerns = () => ({
  type: actions.DASHBOARD_PROTECTION_CONCERNS,
  api: {
    path: RECORD_PATH.dashboards,
    params: { names: DASHBOARD_GROUP_NAMES.protection_concerns },
    db: {
      collection: DB_COLLECTIONS_NAMES.DASHBOARDS,
      groupName: DASHBOARD_GROUP.protection_concerns
    }
  }
});

export const fetchDashboardViolationsCategoryVerificationStatus = () => ({
  type: actions.DASHBOARD_VIOLATIONS_CATEGORY_VERIFICATION_STATUS,
  api: {
    path: RECORD_PATH.dashboards,
    params: { names: DASHBOARD_GROUP_NAMES.violations_category_verification_status },
    db: {
      collection: DB_COLLECTIONS_NAMES.DASHBOARDS,
      groupName: DASHBOARD_GROUP.violations_category_verification_status
    }
  }
});

export const fetchDashboardViolationsCategoryRegion = () => ({
  type: actions.DASHBOARD_VIOLATIONS_CATEGORY_REGION,
  api: {
    path: RECORD_PATH.dashboards,
    params: { names: DASHBOARD_GROUP_NAMES.violations_category_region },
    db: {
      collection: DB_COLLECTIONS_NAMES.DASHBOARDS,
      groupName: DASHBOARD_GROUP.violations_category_region
    }
  }
});

export const fetchDashboardPerpetratorArmedForceGroupPartyNames = () => ({
  type: actions.DASHBOARD_PERPETRATOR_ARMED_FORCE_GROUP_PARTY_NAMES,
  api: {
    path: RECORD_PATH.dashboards,
    params: { names: DASHBOARD_GROUP_NAMES.perpetrator_armed_force_group_party_names },
    db: {
      collection: DB_COLLECTIONS_NAMES.DASHBOARDS,
      groupName: DASHBOARD_GROUP.perpetrator_armed_force_group_party_names
    }
  }
});
