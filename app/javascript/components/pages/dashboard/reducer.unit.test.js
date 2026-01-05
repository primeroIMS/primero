// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import * as userActions from "../../user/actions";

import actions from "./actions";
import reducer from "./reducer";

describe("<Dashboard /> - Reducers", () => {
  const nsReducer = reducer.dashboard;
  const initialState = fromJS({});

  it("should handle DASHBOARD_OVERVIEW_STARTED", () => {
    const expected = fromJS({ overview: { loading: true, errors: false } });
    const action = {
      type: actions.DASHBOARD_OVERVIEW_STARTED,
      payload: true
    };

    const newState = nsReducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle DASHBOARD_OVERVIEW_SUCCESS", () => {
    const data = [
      {
        name: "dashboard.case_risk",
        type: "indicator",
        stats: {
          high: {
            count: 2,
            query: ["record_state=true", "status=open", "risk_level=high"]
          },
          medium: {
            count: 1,
            query: ["record_state=true", "status=open", "risk_level=medium"]
          },
          none: {
            count: 0,
            query: ["record_state=true", "status=open", "risk_level=none"]
          }
        }
      }
    ];
    const expected = fromJS({ overview: { data } });
    const action = {
      type: actions.DASHBOARD_OVERVIEW_SUCCESS,
      payload: { data }
    };
    const newState = nsReducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle DASHBOARD_OVERVIEW_FINISHED", () => {
    const expected = fromJS({ overview: { loading: false } });
    const action = {
      type: actions.DASHBOARD_OVERVIEW_FINISHED,
      payload: false
    };

    const newState = nsReducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle DASHBOARD_OVERVIEW_FAILURE", () => {
    const expected = fromJS({ overview: { errors: true, loading: false } });
    const action = {
      type: actions.DASHBOARD_OVERVIEW_FAILURE,
      payload: true
    };

    const newState = nsReducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle user/LOGOUT_SUCCESS", () => {
    const expected = fromJS({});
    const defaultState = fromJS({});

    const action = {
      type: userActions.LOGOUT_SUCCESS,
      payload: true
    };

    const newState = nsReducer(defaultState, action);

    expect(newState).toEqual(expected);
  });

  it("handles DASHBOARD_APPROVALS_STARTED", () => {
    const defaultState = fromJS({});

    const action = {
      type: actions.DASHBOARD_APPROVALS_STARTED,
      payload: true
    };

    const newState = nsReducer(defaultState, action);

    expect(newState).toEqual(fromJS({ approvals: { loading: true, errors: false } }));
  });

  describe("DASHBOARD_APPROVALS_SUCCESS", () => {
    const approvalCp = {
      name: "dashboard.approvals_assessment.primeromodule-cp",
      type: "indicator",
      indicators: {
        "approval_assessment_pending.primeromodule-cp": {
          count: 5,
          query: [
            "record_state=true",
            "status=open",
            "approval_status_assessment=pending",
            "module_id=primeromodule-cp"
          ]
        }
      }
    };

    it("stores the response when is empty", () => {
      const defaultState = fromJS({});

      const action = {
        type: actions.DASHBOARD_APPROVALS_SUCCESS,
        payload: {
          data: [approvalCp]
        }
      };

      const newState = nsReducer(defaultState, action);

      expect(newState).toEqual(fromJS({ approvals: { data: [approvalCp] } }));
    });

    it("replaces data for the same module", () => {
      const defaultState = fromJS({
        approvals: {
          data: [approvalCp]
        }
      });

      const newApprovalCp = {
        name: "dashboard.approvals_assessment.primeromodule-cp",
        type: "indicator",
        indicators: {
          "approval_assessment_pending.primeromodule-cp": {
            count: 5,
            query: [
              "record_state=true",
              "status=open",
              "approval_status_assessment=pending",
              "module_id=primeromodule-cp"
            ]
          }
        }
      };

      const action = {
        type: actions.DASHBOARD_APPROVALS_SUCCESS,
        payload: {
          data: [newApprovalCp]
        }
      };

      const newState = nsReducer(defaultState, action);

      expect(newState).toEqual(fromJS({ approvals: { data: [newApprovalCp] } }));
    });

    it("adds data for a different module", () => {
      const approvalGbv = {
        name: "dashboard.approvals_assessment.primeromodule-gbv",
        type: "indicator",
        indicators: {
          "approval_assessment_pending.primeromodule-gbv": {
            count: 7,
            query: [
              "record_state=true",
              "status=open",
              "approval_status_assessment=pending",
              "module_id=primeromodule-gbv"
            ]
          }
        }
      };

      const defaultState = fromJS({
        approvals: { data: [approvalGbv] }
      });

      const action = {
        type: actions.DASHBOARD_APPROVALS_SUCCESS,
        payload: {
          data: [approvalCp]
        }
      };

      const newState = nsReducer(defaultState, action);

      expect(newState).toEqual(fromJS({ approvals: { data: [approvalGbv, approvalCp] } }));
    });
  });

  it("handles DASHBOARD_APPROVALS_FAILURE", () => {
    const defaultState = fromJS({});

    const action = {
      type: actions.DASHBOARD_APPROVALS_FAILURE,
      payload: true
    };

    const newState = nsReducer(defaultState, action);

    expect(newState).toEqual(fromJS({ approvals: { loading: false, errors: true } }));
  });

  it("handles DASHBOARD_APPROVALS_FINISHED", () => {
    const defaultState = fromJS({});

    const action = {
      type: actions.DASHBOARD_APPROVALS_FINISHED,
      payload: true
    };

    const newState = nsReducer(defaultState, action);

    expect(newState).toEqual(fromJS({ approvals: { loading: false } }));
  });

  it("handles DASHBOARD_APPROVALS_PENDING_STARTED", () => {
    const defaultState = fromJS({});

    const action = {
      type: actions.DASHBOARD_APPROVALS_PENDING_STARTED,
      payload: true
    };

    const newState = nsReducer(defaultState, action);

    expect(newState).toEqual(fromJS({ approvals_pending: { loading: true, errors: false } }));
  });

  describe("DASHBOARD_APPROVALS_PENDING_SUCCESS", () => {
    const approvalCp = {
      name: "dashboard.approvals_assessment_pending.primeromodule-cp",
      type: "indicator",
      indicators: {
        "approval_assessment_pending_group.primeromodule-cp": {
          count: 5,
          query: [
            "record_state=true",
            "status=open",
            "approval_status_assessment=pending",
            "module_id=primeromodule-cp"
          ]
        }
      }
    };

    it("stores the response when is empty", () => {
      const defaultState = fromJS({});

      const action = {
        type: actions.DASHBOARD_APPROVALS_PENDING_SUCCESS,
        payload: {
          data: [approvalCp]
        }
      };

      const newState = nsReducer(defaultState, action);

      expect(newState).toEqual(fromJS({ approvals_pending: { data: [approvalCp] } }));
    });

    it("replaces data for the same module", () => {
      const defaultState = fromJS({
        approvals_pending: {
          data: [approvalCp]
        }
      });

      const newApprovalCp = {
        name: "dashboard.approvals_assessment_pending.primeromodule-cp",
        type: "indicator",
        indicators: {
          "approval_assessment_pending_group.primeromodule-cp": {
            count: 5,
            query: [
              "record_state=true",
              "status=open",
              "approval_status_assessment=pending",
              "module_id=primeromodule-cp"
            ]
          }
        }
      };

      const action = {
        type: actions.DASHBOARD_APPROVALS_PENDING_SUCCESS,
        payload: {
          data: [newApprovalCp]
        }
      };

      const newState = nsReducer(defaultState, action);

      expect(newState).toEqual(fromJS({ approvals_pending: { data: [newApprovalCp] } }));
    });

    it("adds data for a different module", () => {
      const approvalGbv = {
        name: "dashboard.approvals_assessment_pending.primeromodule-gbv",
        type: "indicator",
        indicators: {
          "approval_assessment_pending_group.primeromodule-gbv": {
            count: 7,
            query: [
              "record_state=true",
              "status=open",
              "approval_status_assessment=pending",
              "module_id=primeromodule-gbv"
            ]
          }
        }
      };

      const defaultState = fromJS({ approvals_pending: { data: [approvalGbv] } });

      const action = {
        type: actions.DASHBOARD_APPROVALS_PENDING_SUCCESS,
        payload: { data: [approvalCp] }
      };

      const newState = nsReducer(defaultState, action);

      expect(newState).toEqual(fromJS({ approvals_pending: { data: [approvalGbv, approvalCp] } }));
    });
  });

  it("handles DASHBOARD_APPROVALS_PENDING_FAILURE", () => {
    const defaultState = fromJS({});

    const action = {
      type: actions.DASHBOARD_APPROVALS_PENDING_FAILURE,
      payload: true
    };

    const newState = nsReducer(defaultState, action);

    expect(newState).toEqual(fromJS({ approvals_pending: { loading: false, errors: true } }));
  });

  it("handles DASHBOARD_APPROVALS_PENDING_FINISHED", () => {
    const defaultState = fromJS({});

    const action = {
      type: actions.DASHBOARD_APPROVALS_PENDING_FINISHED,
      payload: true
    };

    const newState = nsReducer(defaultState, action);

    expect(newState).toEqual(fromJS({ approvals_pending: { loading: false } }));
  });
});
