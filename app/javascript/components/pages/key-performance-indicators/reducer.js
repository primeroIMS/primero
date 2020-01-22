import { fromJS, Map } from "immutable";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.NUMBER_OF_CASES_SUCCESS:
      return state.set("numberOfCases", fromJS(payload))
    case Actions.NUMBER_OF_INCIDENTS_SUCCESS:
      return state.set("numberOfIncidents", fromJS(payload))
    case Actions.REPORTING_DELAY_SUCCESS:
      return state.set("reportingDelay", fromJS(payload))
    case Actions.SERVICE_ACCESS_DELAY_SUCCESS:
      return state.set("serviceAccessDelay", fromJS(payload))
    case Actions.ASSESSMENT_STATUS_SUCCESS:
      return state.set("assessmentStatus", fromJS(payload))
    case Actions.COMPLETED_CASE_SAFETY_PLANS_SUCCESS:
      return state.set('completedCaseSafetyPlans', fromJS(payload))
    case Actions.COMPLETED_CASE_ACTION_PLANS_SUCCESS:
      return state.set('completedCaseActionPlans', fromJS(payload))
    case Actions.COMPLETED_SUPERVISOR_APPROVED_CASE_ACTION_PLANS_SUCCESS:
      return state.set('completedSupervisorApprovedCaseActionPlans', fromJS(payload))
    case Actions.SERVICES_PROVIDED_SUCCESS:
      return state.set("servicesProvided", fromJS(payload))
    default:
      return state;
  }
};

export const reducer = { [NAMESPACE]: reducer };
