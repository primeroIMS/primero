import { fromJS } from "immutable";
import NAMESPACE from "./namespace";

export const numberOfCases = state => {
  return state.getIn(["records", NAMESPACE, 'numberOfCases'], fromJS({
    dates: [],
    data: []
  }));
};

export const numberOfIncidents = state => {
  return state.getIn(["records", NAMESPACE, 'numberOfIncidents'], fromJS({
    dates: [],
    data: []
  }));
};

export const reportingDelay = state => {
  return state.getIn(["records", NAMESPACE, 'reportingDelay'], fromJS({
    data: []
  }));
};

export const serviceAccessDelay = state => {
  return state.getIn(["records", NAMESPACE, 'serviceAccessDelay'], fromJS({
    data: []
  }));
};

export const assessmentStatus = state => {
  return state.getIn(["records", NAMESPACE, 'assessmentStatus'], fromJS({
    data: {
      completed_supervisor_approved: 0,
      completed_only: 0
    }
  }));
};

export const completedCaseSafetyPlans = state => {
  return state.getIn(["records", NAMESPACE, 'completedCaseSafetyPlans'], fromJS({
    data: {
      completed_case_safety_plans: 0
    }
  }));
};
