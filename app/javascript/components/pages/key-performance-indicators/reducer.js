import { fromJS, Map } from "immutable";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({});

// TODO: Lots of strings here with no warn of spelling mistakes. We should
// move these over to a core set of defined strings with language features
// that will warn us when they are wrong.

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  let identifier = type.match(/KeyPerformanceIndicators\/([a-z_]*?)_SUCCESS/)?.[1];

  if (identifier) {
    return state.set(identifier, fromJS(payload));
  }

  switch (type) {
    case Actions.SERVICE_ACCESS_DELAY_SUCCESS:
      return state.set("serviceAccessDelay", fromJS(payload));
    case Actions.ASSESSMENT_STATUS_SUCCESS:
      return state.set("assessmentStatus", fromJS(payload));
    case Actions.COMPLETED_CASE_SAFETY_PLANS_SUCCESS:
      return state.set('completedCaseSafetyPlans', fromJS(payload));
    case Actions.COMPLETED_CASE_ACTION_PLANS_SUCCESS:
      return state.set('completedCaseActionPlans', fromJS(payload));
    case Actions.COMPLETED_SUPERVISOR_APPROVED_CASE_ACTION_PLANS_SUCCESS:
      return state.set('completedSupervisorApprovedCaseActionPlans', fromJS(payload));
    case Actions.SERVICES_PROVIDED_SUCCESS:
      return state.set("servicesProvided", fromJS(payload));
    case Actions.AVERAGE_REFERRALS_SUCCESS:
      return state.set("averageReferrals", fromJS(payload));
    case Actions.REFERRALS_PER_SERVICE_SUCCESS:
      return state.set("referralsPerService", fromJS(payload));
    case Actions.AVERAGE_FOLLOWUP_MEETINGS_PER_CASE_SUCCESS:
      return state.set("averageFollowupMeetingsPerCase", fromJS(payload));
    case Actions.GOAL_PROGRESS_PER_NEED_SUCCESS:
      return state.set("goalProgressPerNeed", fromJS(payload));
    default:
      return state;
  }
};

export const reducer = { [NAMESPACE]: reducer };
