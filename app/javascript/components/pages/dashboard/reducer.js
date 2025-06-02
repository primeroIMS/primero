// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS, Map } from "immutable";
import orderBy from "lodash/orderBy";

import actions from "./actions";
import NAMESPACE from "./namespace";
import { DASHBOARD_FLAGS_SORT_ORDER, DASHBOARD_FLAGS_SORT_FIELD, DASHBOARD_GROUP } from "./constants";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.DASHBOARD_OVERVIEW_STARTED:
      return state
        .setIn([DASHBOARD_GROUP.overview, "loading"], true)
        .setIn([DASHBOARD_GROUP.overview, "errors"], false);
    case actions.DASHBOARD_OVERVIEW_SUCCESS:
      return state.setIn([DASHBOARD_GROUP.overview, "data"], fromJS(payload.data));
    case actions.DASHBOARD_OVERVIEW_FAILURE:
      return state
        .setIn([DASHBOARD_GROUP.overview, "loading"], false)
        .setIn([DASHBOARD_GROUP.overview, "errors"], true);
    case actions.DASHBOARD_OVERVIEW_FINISHED:
      return state.setIn([DASHBOARD_GROUP.overview, "loading"], false);
    case actions.DASHBOARD_ACTION_NEEDED_STARTED:
      return state
        .setIn([DASHBOARD_GROUP.action_needed, "loading"], true)
        .setIn([DASHBOARD_GROUP.action_needed, "errors"], false);
    case actions.DASHBOARD_ACTION_NEEDED_SUCCESS:
      return state.setIn([DASHBOARD_GROUP.action_needed, "data"], fromJS(payload.data));
    case actions.DASHBOARD_ACTION_NEEDED_FAILURE:
      return state
        .setIn([DASHBOARD_GROUP.action_needed, "loading"], false)
        .setIn([DASHBOARD_GROUP.action_needed, "errors"], true);
    case actions.DASHBOARD_ACTION_NEEDED_FINISHED:
      return state.setIn([DASHBOARD_GROUP.action_needed, "loading"], false);
    case actions.DASHBOARD_WORKFLOW_STARTED:
      return state
        .setIn([DASHBOARD_GROUP.workflow, "loading"], true)
        .setIn([DASHBOARD_GROUP.workflow, "errors"], false);
    case actions.DASHBOARD_WORKFLOW_SUCCESS:
      return state.setIn([DASHBOARD_GROUP.workflow, "data"], fromJS(payload.data));
    case actions.DASHBOARD_WORKFLOW_FAILURE:
      return state
        .setIn([DASHBOARD_GROUP.workflow, "loading"], false)
        .setIn([DASHBOARD_GROUP.workflow, "errors"], true);
    case actions.DASHBOARD_WORKFLOW_FINISHED:
      return state.setIn([DASHBOARD_GROUP.workflow, "loading"], false);
    case actions.DASHBOARD_APPROVALS_STARTED:
      return state
        .setIn([DASHBOARD_GROUP.approvals, "loading"], true)
        .setIn([DASHBOARD_GROUP.approvals, "errors"], false);
    case actions.DASHBOARD_APPROVALS_SUCCESS:
      return state.setIn([DASHBOARD_GROUP.approvals, "data"], fromJS(payload.data));
    case actions.DASHBOARD_APPROVALS_FAILURE:
      return state
        .setIn([DASHBOARD_GROUP.approvals, "loading"], false)
        .setIn([DASHBOARD_GROUP.approvals, "errors"], true);
    case actions.DASHBOARD_APPROVALS_FINISHED:
      return state.setIn([DASHBOARD_GROUP.approvals, "loading"], false);
    case actions.DASHBOARD_REFERRALS_TRANSFERS_STARTED:
      return state
        .setIn([DASHBOARD_GROUP.referrals_transfers, "loading"], true)
        .setIn([DASHBOARD_GROUP.referrals_transfers, "errors"], false);
    case actions.DASHBOARD_REFERRALS_TRANSFERS_SUCCESS:
      return state.setIn([DASHBOARD_GROUP.referrals_transfers, "data"], fromJS(payload.data));
    case actions.DASHBOARD_REFERRALS_TRANSFERS_FAILURE:
      return state
        .setIn([DASHBOARD_GROUP.referrals_transfers, "loading"], false)
        .setIn([DASHBOARD_GROUP.referrals_transfers, "errors"], true);
    case actions.DASHBOARD_REFERRALS_TRANSFERS_FINISHED:
      return state.setIn([DASHBOARD_GROUP.referrals_transfers, "loading"], false);
    case actions.DASHBOARD_SHARED_FROM_MY_TEAM_STARTED:
      return state
        .setIn([DASHBOARD_GROUP.shared_from_my_team, "loading"], true)
        .setIn([DASHBOARD_GROUP.shared_from_my_team, "errors"], false);
    case actions.DASHBOARD_SHARED_FROM_MY_TEAM_SUCCESS:
      return state.setIn([DASHBOARD_GROUP.shared_from_my_team, "data"], fromJS(payload.data));
    case actions.DASHBOARD_SHARED_FROM_MY_TEAM_FAILURE:
      return state
        .setIn([DASHBOARD_GROUP.shared_from_my_team, "loading"], false)
        .setIn([DASHBOARD_GROUP.shared_from_my_team, "errors"], true);
    case actions.DASHBOARD_SHARED_FROM_MY_TEAM_FINISHED:
      return state.setIn([DASHBOARD_GROUP.shared_from_my_team, "loading"], false);
    case actions.DASHBOARD_SHARED_WITH_MY_TEAM_STARTED:
      return state
        .setIn([DASHBOARD_GROUP.shared_with_my_team, "loading"], true)
        .setIn([DASHBOARD_GROUP.shared_with_my_team, "errors"], false);
    case actions.DASHBOARD_SHARED_WITH_MY_TEAM_SUCCESS:
      return state.setIn([DASHBOARD_GROUP.shared_with_my_team, "data"], fromJS(payload.data));
    case actions.DASHBOARD_SHARED_WITH_MY_TEAM_FAILURE:
      return state
        .setIn([DASHBOARD_GROUP.shared_with_my_team, "loading"], false)
        .setIn([DASHBOARD_GROUP.shared_with_my_team, "errors"], true);
    case actions.DASHBOARD_SHARED_WITH_MY_TEAM_FINISHED:
      return state.setIn([DASHBOARD_GROUP.shared_with_my_team, "loading"], false);
    case actions.DASHBOARD_CASES_TO_ASSIGN_STARTED:
      return state
        .setIn([DASHBOARD_GROUP.cases_to_assign, "loading"], true)
        .setIn([DASHBOARD_GROUP.cases_to_assign, "errors"], false);
    case actions.DASHBOARD_CASES_TO_ASSIGN_SUCCESS:
      return state.setIn([DASHBOARD_GROUP.cases_to_assign, "data"], fromJS(payload.data));
    case actions.DASHBOARD_CASES_TO_ASSIGN_FAILURE:
      return state
        .setIn([DASHBOARD_GROUP.cases_to_assign, "loading"], false)
        .setIn([DASHBOARD_GROUP.cases_to_assign, "errors"], true);
    case actions.DASHBOARD_CASES_TO_ASSIGN_FINISHED:
      return state.setIn([DASHBOARD_GROUP.cases_to_assign, "loading"], false);

    case actions.DASHBOARD_OVERDUE_TASKS_STARTED:
      return state
        .setIn([DASHBOARD_GROUP.overdue_tasks, "loading"], true)
        .setIn([DASHBOARD_GROUP.overdue_tasks, "errors"], false);
    case actions.DASHBOARD_OVERDUE_TASKS_SUCCESS:
      return state.setIn([DASHBOARD_GROUP.overdue_tasks, "data"], fromJS(payload.data));
    case actions.DASHBOARD_OVERDUE_TASKS_FAILURE:
      return state
        .setIn([DASHBOARD_GROUP.overdue_tasks, "loading"], false)
        .setIn([DASHBOARD_GROUP.overdue_tasks, "errors"], true);
    case actions.DASHBOARD_OVERDUE_TASKS_FINISHED:
      return state.setIn([DASHBOARD_GROUP.overdue_tasks, "loading"], false);
    case actions.DASHBOARD_CASES_BY_SOCIAL_WORKER_STARTED:
      return state
        .setIn([DASHBOARD_GROUP.cases_by_social_worker, "loading"], true)
        .setIn([DASHBOARD_GROUP.cases_by_social_worker, "errors"], false);
    case actions.DASHBOARD_CASES_BY_SOCIAL_WORKER_SUCCESS:
      return state.setIn([DASHBOARD_GROUP.cases_by_social_worker, "data"], fromJS(payload.data));
    case actions.DASHBOARD_CASES_BY_SOCIAL_WORKER_FAILURE:
      return state
        .setIn([DASHBOARD_GROUP.cases_by_social_worker, "loading"], false)
        .setIn([DASHBOARD_GROUP.cases_by_social_worker, "errors"], true);
    case actions.DASHBOARD_CASES_BY_SOCIAL_WORKER_FINISHED:
      return state.setIn([DASHBOARD_GROUP.cases_by_social_worker, "loading"], false);
    case actions.DASHBOARD_WORKFLOW_TEAM_STARTED:
      return state
        .setIn([DASHBOARD_GROUP.workflow_team, "loading"], true)
        .setIn([DASHBOARD_GROUP.workflow_team, "errors"], false);
    case actions.DASHBOARD_WORKFLOW_TEAM_SUCCESS:
      return state.setIn([DASHBOARD_GROUP.workflow_team, "data"], fromJS(payload.data));
    case actions.DASHBOARD_WORKFLOW_TEAM_FAILURE:
      return state
        .setIn([DASHBOARD_GROUP.workflow_team, "loading"], false)
        .setIn([DASHBOARD_GROUP.workflow_team, "errors"], true);
    case actions.DASHBOARD_WORKFLOW_TEAM_FINISHED:
      return state.setIn([DASHBOARD_GROUP.workflow_team, "loading"], false);
    case actions.DASHBOARD_REPORTING_LOCATION_STARTED:
      return state
        .setIn([DASHBOARD_GROUP.reporting_location, "loading"], true)
        .setIn([DASHBOARD_GROUP.reporting_location, "errors"], false);
    case actions.DASHBOARD_REPORTING_LOCATION_SUCCESS:
      return state.setIn([DASHBOARD_GROUP.reporting_location, "data"], fromJS(payload.data));
    case actions.DASHBOARD_REPORTING_LOCATION_FAILURE:
      return state
        .setIn([DASHBOARD_GROUP.reporting_location, "loading"], false)
        .setIn([DASHBOARD_GROUP.reporting_location, "errors"], true);
    case actions.DASHBOARD_REPORTING_LOCATION_FINISHED:
      return state.setIn([DASHBOARD_GROUP.reporting_location, "loading"], false);
    case actions.DASHBOARD_PROTECTION_CONCERNS_STARTED:
      return state
        .setIn([DASHBOARD_GROUP.protection_concerns, "loading"], true)
        .setIn([DASHBOARD_GROUP.protection_concerns, "errors"], false);
    case actions.DASHBOARD_PROTECTION_CONCERNS_SUCCESS:
      return state.setIn([DASHBOARD_GROUP.protection_concerns, "data"], fromJS(payload.data));
    case actions.DASHBOARD_PROTECTION_CONCERNS_FAILURE:
      return state
        .setIn([DASHBOARD_GROUP.protection_concerns, "loading"], false)
        .setIn([DASHBOARD_GROUP.protection_concerns, "errors"], true);
    case actions.DASHBOARD_PROTECTION_CONCERNS_FINISHED:
      return state.setIn([DASHBOARD_GROUP.protection_concerns, "loading"], false);
    case actions.DASHBOARD_VIOLATIONS_CATEGORY_VERIFICATION_STATUS_STARTED:
      return state
        .setIn([DASHBOARD_GROUP.violations_category_verification_status, "loading"], true)
        .setIn([DASHBOARD_GROUP.violations_category_verification_status, "errors"], false);
    case actions.DASHBOARD_VIOLATIONS_CATEGORY_VERIFICATION_STATUS_SUCCESS:
      return state.setIn([DASHBOARD_GROUP.violations_category_verification_status, "data"], fromJS(payload.data));
    case actions.DASHBOARD_VIOLATIONS_CATEGORY_VERIFICATION_STATUS_FAILURE:
      return state
        .setIn([DASHBOARD_GROUP.violations_category_verification_status, "loading"], false)
        .setIn([DASHBOARD_GROUP.violations_category_verification_status, "errors"], true);
    case actions.DASHBOARD_VIOLATIONS_CATEGORY_VERIFICATION_STATUS_FINISHED:
      return state.setIn([DASHBOARD_GROUP.violations_category_verification_status, "loading"], false);
    case actions.DASHBOARD_VIOLATIONS_CATEGORY_REGION_STARTED:
      return state
        .setIn([DASHBOARD_GROUP.violations_category_region, "loading"], true)
        .setIn([DASHBOARD_GROUP.violations_category_region, "errors"], false);
    case actions.DASHBOARD_VIOLATIONS_CATEGORY_REGION_SUCCESS:
      return state.setIn([DASHBOARD_GROUP.violations_category_region, "data"], fromJS(payload.data));
    case actions.DASHBOARD_VIOLATIONS_CATEGORY_REGION_FAILURE:
      return state
        .setIn([DASHBOARD_GROUP.violations_category_region, "loading"], false)
        .setIn([DASHBOARD_GROUP.violations_category_region, "errors"], true);
    case actions.DASHBOARD_VIOLATIONS_CATEGORY_REGION_FINISHED:
      return state.setIn([DASHBOARD_GROUP.violations_category_region, "loading"], false);
    case actions.DASHBOARD_PERPETRATOR_ARMED_FORCE_GROUP_PARTY_NAMES_STARTED:
      return state
        .setIn([DASHBOARD_GROUP.violations_category_region, "loading"], true)
        .setIn([DASHBOARD_GROUP.perpetrator_armed_force_group_party_names, "errors"], false);
    case actions.DASHBOARD_PERPETRATOR_ARMED_FORCE_GROUP_PARTY_NAMES_SUCCESS:
      return state.setIn([DASHBOARD_GROUP.perpetrator_armed_force_group_party_names, "data"], fromJS(payload.data));
    case actions.DASHBOARD_PERPETRATOR_ARMED_FORCE_GROUP_PARTY_NAMES_FAILURE:
      return state
        .setIn([DASHBOARD_GROUP.perpetrator_armed_force_group_party_names, "loading"], false)
        .setIn([DASHBOARD_GROUP.perpetrator_armed_force_group_party_names, "errors"], true);
    case actions.DASHBOARD_PERPETRATOR_ARMED_FORCE_GROUP_PARTY_NAMES_FINISHED:
      return state.setIn([DASHBOARD_GROUP.perpetrator_armed_force_group_party_names, "loading"], false);
    case actions.DASHBOARD_FLAGS_STARTED:
      return state.setIn([DASHBOARD_GROUP.flags, "loading"], true).setIn([DASHBOARD_GROUP.flags, "errors"], false);
    case actions.DASHBOARD_FLAGS_SUCCESS: {
      const orderedArray = orderBy(payload.data, dateObj => new Date(dateObj[DASHBOARD_FLAGS_SORT_FIELD]), [
        DASHBOARD_FLAGS_SORT_ORDER
      ]);

      return state
        .setIn([DASHBOARD_GROUP.flags, "data"], fromJS(orderedArray))
        .setIn([DASHBOARD_GROUP.flags, "metadata"], fromJS(payload.metadata));
    }
    case actions.DASHBOARD_FLAGS_FINISHED:
      return state.setIn([DASHBOARD_GROUP.flags, "loading"], false);
    case actions.DASHBOARD_FLAGS_FAILURE:
      return state.setIn([DASHBOARD_GROUP.flags, "errors"], true);
    case actions.OPEN_PAGE_ACTIONS:
      return state.set("isOpenPageActions", fromJS(payload));
    case "user/LOGOUT_SUCCESS":
      return DEFAULT_STATE;
    default:
      return state;
  }
};

export default { [NAMESPACE]: reducer };
