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

export const completedCaseActionPlans = state => {
  return state.getIn(["records", NAMESPACE, 'completedCaseActionPlans'], fromJS({
    data: {
      completed_case_action_plans: 0
    }
  }));
};

export const completedSupervisorApprovedCaseActionPlans = state => {
  return state.getIn(["records", NAMESPACE, 'completedSupervisorApprovedCaseActionPlans'], fromJS({
    data: {
      completed_supervisor_approved_case_action_plans: 0
    }
  }));
};

export const servicesProvided = state => {
  return state.getIn(["records", NAMESPACE, 'servicesProvided'], fromJS({
    data: {
      services_provided: []
    }
  }));
}

export const averageReferrals = state => {
  return state.getIn(["records", NAMESPACE, 'averageReferrals'], fromJS({
    data: {
      average_referrals: 0
    }
  }));
}

export const referralsPerService = state => {
  return state.getIn(["records", NAMESPACE, 'referralsPerService'], fromJS({
    data: []
  }));
}

export const averageFollowupMeetingsPerCase = state => {
  return state.getIn(["records", NAMESPACE, 'averageFollowupMeetingsPerCase'], fromJS({
    data: {
      average_meetings: 0
    }
  }));
}
