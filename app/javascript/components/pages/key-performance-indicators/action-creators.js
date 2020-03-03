import * as Actions from "./actions";

export const fetchNumberOfCases = (dateRange) => async dispatch => {
  dispatch({
    type: Actions.NUMBER_OF_CASES,
    api: {
      path: "key_performance_indicators/number_of_cases",
      params: { from: dateRange.from, to: dateRange.to }
    }
  });
};

export const fetchNumberOfIncidents = (dateRange) => async dispatch => {
  dispatch({
    type: Actions.NUMBER_OF_INCIDENTS,
    api: {
      path: "key_performance_indicators/number_of_incidents",
      params: { from: dateRange.from, to: dateRange.to }
    }
  });
};

export const fetchReportingDelay = (dateRange) => async dispatch => {
  dispatch({
    type: Actions.REPORTING_DELAY,
    api: {
      path: "key_performance_indicators/reporting_delay",
      params: { from: dateRange.from, to: dateRange.to }
    }
  });
};

export const fetchServiceAccessDelay = (dateRange) => async dispatch => {
  dispatch({
    type: Actions.SERVICE_ACCESS_DELAY,
    api: {
      path: "key_performance_indicators/service_access_delay",
      params: { from: dateRange.from, to: dateRange.to }
    }
  });
};

export const fetchAssessmentStatus = () => async dispatch => {
  dispatch({
    type: Actions.ASSESSMENT_STATUS,
    api: {
      path: "key_performance_indicators/assessment_status"
    }
  })
}

export const fetchCompletedCaseSafetyPlans = () => async dispatch => {
  dispatch({
    type: Actions.COMPLETED_CASE_SAFETY_PLANS,
    api: {
      path: "key_performance_indicators/completed_case_safety_plans"
    }
  })
}

export const fetchCompletedCaseActionPlans = () => async dispatch => {
  dispatch({
    type: Actions.COMPLETED_CASE_ACTION_PLANS,
    api: {
      path: "key_performance_indicators/completed_case_action_plans"
    }
  })
}

export const fetchCompletedSupervisorApprovedCaseActionPlans = () => async dispatch => {
  dispatch({
    type: Actions.COMPLETED_SUPERVISOR_APPROVED_CASE_ACTION_PLANS,
    api: {
      path: "key_performance_indicators/completed_supervisor_approved_case_action_plans"
    }
  })
}

export const fetchServicesProvided = () => async dispatch => {
  dispatch({
    type: Actions.SERVICES_PROVIDED,
    api: {
      path: "key_performance_indicators/services_provided"
    }
  })
}
