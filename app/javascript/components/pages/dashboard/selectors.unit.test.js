import { expect } from "chai";
import { fromJS } from "immutable";

import { DASHBOARD_NAMES } from "./constants";
import * as selectors from "./selectors";

const workflowTeamCases = {
  name: DASHBOARD_NAMES.WORKFLOW_TEAM,
  type: "indicator",
  stats: {
    primero: {
      new: {
        count: 2,
        query: ["record_state=true", "status=open", "risk_level=high"]
      }
    },
    primero_cp: {
      new: {
        count: 1,
        query: ["record_state=true", "status=open", "risk_level=high"]
      }
    }
  }
};

const reportingLocation = {
  name: "dashboard.reporting_location",
  type: "indicator",
  indicators: {
    reporting_location_open: {
      "1506060": {
        count: 1,
        query: [
          "record_state=true",
          "status=open",
          "owned_by_location2=1506060"
        ]
      }
    },
    reporting_location_open_last_week: {},
    reporting_location_open_this_week: {},
    reporting_location_closed_last_week: {},
    reporting_location_closed_this_week: {}
  }
};

const approvalsAssessmentPending = {
  name: "dashboard.approvals_assessment_pending",
  type: "indicator",
  indicators: {
    approval_assessment_pending_group: {
      count: 3,
      query: ["record_state=true", "status=open", "approval_status_bia=pending"]
    }
  }
};
const approvalsCasePlanPending = {
  name: "dashboard.approvals_case_plan_pending",
  type: "indicator",
  indicators: {
    approval_case_plan_pending_group: {
      count: 2,
      query: [
        "record_state=true",
        "status=open",
        "approval_status_case_plan=pending"
      ]
    }
  }
};
const approvalsClosurePending = {
  name: "dashboard.approvals_closure_pending",
  type: "indicator",
  indicators: {
    approval_closure_pending_group: {
      count: 1,
      query: [
        "record_state=true",
        "status=open",
        "approval_status_closure=pending"
      ]
    }
  }
};

const stateWithoutRecords = fromJS({});
const initialState = fromJS({
  records: {
    dashboard: {
      data: [
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
        },
        workflowTeamCases,
        reportingLocation,
        approvalsAssessmentPending,
        approvalsCasePlanPending,
        approvalsClosurePending
      ]
    }
  }
});

describe("<Dashboard /> - Selectors", () => {
  describe("getCasesByAssessmentLevel", () => {
    it("should return a list of dashboard", () => {
      const records = selectors.getCasesByAssessmentLevel(initialState);

      const expected = fromJS({
        name: DASHBOARD_NAMES.CASE_RISK,
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
      });

      expect(records).to.deep.equal(expected);
    });
  });

  describe("getWorkflowTeamCases", () => {
    it("should return list of headers allowed to the user", () => {
      const values = selectors.getWorkflowTeamCases(initialState);

      expect(values).to.deep.equal(fromJS(workflowTeamCases));
    });

    it("should return false when there are not users in store", () => {
      const values = selectors.getWorkflowTeamCases(stateWithoutRecords);

      expect(values).to.be.empty;
    });
  });

  describe("getReportingLocation", () => {
    it("should return the reporting location config", () => {
      const values = selectors.getReportingLocation(initialState);

      expect(values).to.deep.equal(fromJS(reportingLocation));
    });
  });

  describe("getApprovalsAssessmentPending", () => {
    it("should return the approvals assessment pending", () => {
      const values = selectors.getApprovalsAssessmentPending(initialState);

      expect(values).to.deep.equal(fromJS(approvalsAssessmentPending));
    });
  });

  describe("getApprovalsClosurePending", () => {
    it("should return the approvals case plan pending", () => {
      const values = selectors.getApprovalsClosurePending(initialState);

      expect(values).to.deep.equal(fromJS(approvalsCasePlanPending));
    });
  });

  describe("getApprovalsCasePlanPending", () => {
    it("should return the  approvals closure pending", () => {
      const values = selectors.getApprovalsCasePlanPending(initialState);

      expect(values).to.deep.equal(fromJS(approvalsClosurePending));
    });
  });
});
