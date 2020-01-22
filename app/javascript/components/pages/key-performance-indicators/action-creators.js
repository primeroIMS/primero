import * as Actions from "./actions";

export const fetchNumberOfCases = () => async dispatch => {
  dispatch({
    type: Actions.NUMBER_OF_CASES,
    api: {
      path: "key_performance_indicators/number_of_cases"
    }
  });
};

export const fetchNumberOfIncidents = () => async dispatch => {
  dispatch({
    type: Actions.NUMBER_OF_INCIDENTS,
    api: {
      path: "key_performance_indicators/number_of_incidents"
    }
  });
};

export const fetchReportingDelay = () => async dispatch => {
  dispatch({
    type: Actions.REPORTING_DELAY,
    api: {
      path: "key_performance_indicators/reporting_delay"
    }
  });
};

export const fetchServiceAccessDelay = () => async dispatch => {
  dispatch({
    type: Actions.SERVICE_ACCESS_DELAY,
    api: {
      path: "key_performance_indicators/service_access_delay"
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
