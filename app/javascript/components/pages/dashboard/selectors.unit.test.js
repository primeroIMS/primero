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
        query: ["record_state=true", "status=open", "owned_by_location2=1506060"]
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
      query: ["record_state=true", "status=open", "approval_status_case_plan=pending"]
    }
  }
};
const approvalsClosurePending = {
  name: "dashboard.approvals_closure_pending",
  type: "indicator",
  indicators: {
    approval_closure_pending_group: {
      count: 1,
      query: ["record_state=true", "status=open", "approval_status_closure=pending"]
    }
  }
};

const protectionConcern = {
  name: "dashboard.dash_protection_concerns",
  type: "indicator",
  indicators: {
    protection_concerns_open_cases: {
      statelessness: {
        count: 2,
        query: ["record_state=true", "status=open", "protection_concerns=statelessness"]
      }
    },
    protection_concerns_new_this_week: {
      statelessness: {
        count: 1,
        query: [
          "record_state=true",
          "status=open",
          "created_at=2020-01-26T00:00:00Z..2020-02-01T23:59:59Z",
          "protection_concerns=statelessness"
        ]
      }
    },
    protection_concerns_all_cases: {
      statelessness: {
        count: 4,
        query: ["record_state=true", "protection_concerns=statelessness"]
      }
    },
    protection_concerns_closed_this_week: {
      statelessness: {
        count: 1,
        query: [
          "record_state=true",
          "status=closed",
          "date_closure=2020-01-26T00:00:00Z..2020-02-01T23:59:59Z",
          "protection_concerns=statelessness"
        ]
      }
    }
  }
};

const sharedWithMe = {
  name: "dashboard.dash_shared_with_me",
  type: "indicator",
  indicators: {
    shared_with_me_total_referrals: {
      count: 0,
      query: ["record_state=true", "status=open"]
    },
    shared_with_me_new_referrals: {
      count: 0,
      query: ["record_state=true", "status=open", "not_edited_by_owner=true"]
    },
    shared_with_me_transfers_awaiting_acceptance: {
      count: 0,
      query: ["record_state=true", "status=open"]
    }
  }
};

const sharedWithOthers = {
  name: "dashboard.dash_shared_with_others",
  type: "indicator",
  indicators: {
    shared_with_others_referrals: {
      count: 0,
      query: ["owned_by=primero_cp", "record_state=true", "status=open", "referred_users_present=true"]
    },
    shared_with_others_pending_transfers: {
      count: 0,
      query: ["owned_by=primero_cp", "record_state=true", "status=open", "transfer_status=in_progress"]
    },
    shared_with_others_rejected_transfers: {
      count: 0,
      query: ["owned_by=primero_cp", "record_state=true", "status=open", "transfer_status=rejected"]
    }
  }
};

const groupOverview = {
  name: "dashboard.dash_group_overview",
  type: "indicator",
  indicators: {
    group_overview_open: {
      count: 5,
      query: ["record_state=true", "status=open"]
    },
    group_overview_closed: {
      count: 0,
      query: ["record_state=true", "status=closed"]
    }
  }
};

const caseOverview = {
  name: "dashboard.case_overview",
  type: "indicator",
  indicators: {
    total: {
      count: 2,
      query: ["record_state=true", "status=open"]
    },
    new_or_updated: {
      count: 1,
      query: ["record_state=true", "status=closed", "not_edited_by_owner=true"]
    }
  }
};

const nationalAdminSummary = {
  name: "dashboard.dash_national_admin_summary",
  type: "indicator",
  indicators: {
    total: {
      count: 4,
      query: ["record_state=true", "status=open"]
    },
    new_last_week: {
      count: 2,
      query: ["record_state=true", "status=open", "created_at=2021-04-18T00:00:00Z..2021-04-24T23:59:59Z"]
    },
    new_this_week: {
      count: 2,
      query: ["record_state=true", "status=open", "created_at=2021-04-25T00:00:00Z..2021-05-01T23:59:59Z"]
    },
    closed_last_week: {
      count: 0,
      query: ["record_state=true", "status=closed", "created_at=2021-04-18T00:00:00Z..2021-04-24T23:59:59Z"]
    },
    closed_this_week: {
      count: 0,
      query: ["record_state=true", "status=closed", "created_at=2021-04-25T00:00:00Z..2021-05-01T23:59:59Z"]
    }
  }
};

const sharedWithMyTeam = {
  name: "dashboard.dash_shared_with_my_team",
  type: "indicator",
  indicators: {
    shared_with_my_team_referrals: {
      primero_cp: { count: 1, query: ["referred_users=primero_cp"] }
    },
    shared_with_my_team_pending_transfers: {
      primero_cp: { count: 2, query: ["transferred_to_users=primero_cp"] },
      primero_cp_ar: {
        count: 1,
        query: ["transferred_to_users=primero_cp_ar"]
      }
    }
  }
};

const myCasesIncidents = {
  name: "dashboard.dash_case_incident_overview",
  type: "indicator",
  indicators: {
    new_or_updated: {
      query: ["record_state=true", "status=open", "not_edited_by_owner=true"],
      count: 1
    },
    total: {
      query: ["record_state=true", "status=open"],
      count: 2
    },
    with_incidents: {
      query: ["record_state=true", "status=open", "has_incidents=true"],
      count: 0
    },
    without_incidents: {
      query: ["record_state=true", "status=open", "has_incidents=false"],
      count: 1
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
        approvalsClosurePending,
        protectionConcern,
        sharedWithMe,
        sharedWithOthers,
        groupOverview,
        caseOverview,
        sharedWithMyTeam,
        myCasesIncidents,
        nationalAdminSummary
      ],
      flags: {
        loading: false,
        errors: false,
        data: [
          {
            message: "Reason 1",
            removed: false,
            record_type: "cases"
          },
          {
            message: "Reason 2",
            removed: true,
            record_type: "cases"
          }
        ]
      }
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

  describe("getCasesByAssessmentLevel empty value", () => {
    it("should return a map when dashboard is empty", () => {
      const emptyResult = fromJS({});

      const emptyValueInitialState = fromJS({
        name: DASHBOARD_NAMES.CASE_RISK,
        type: "indicator",
        stats: {}
      });

      const expected = selectors.getCasesByAssessmentLevel(emptyValueInitialState);

      expect(emptyResult).to.deep.equal(expected);
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

  describe("getApprovalsCasePlanPending", () => {
    it("should return the approvals case plan pending", () => {
      const values = selectors.getApprovalsCasePlanPending(initialState);

      expect(values).to.deep.equal(fromJS(approvalsCasePlanPending));
    });
  });

  describe("getApprovalsClosurePending", () => {
    it("should return the approvals closure pending", () => {
      const values = selectors.getApprovalsClosurePending(initialState);

      expect(values).to.deep.equal(fromJS(approvalsClosurePending));
    });
  });

  describe("getProtectionConcerns", () => {
    it("should return the protection concerns data", () => {
      const values = selectors.getProtectionConcerns(initialState);

      expect(values).to.deep.equal(fromJS(protectionConcern));
    });
  });

  describe("getSharedWithMe", () => {
    it("should return the shared with me", () => {
      const values = selectors.getSharedWithMe(initialState);

      expect(values).to.deep.equal(fromJS(sharedWithMe));
    });
  });

  describe("getSharedWithOthers", () => {
    it("should return the shared with others", () => {
      const values = selectors.getSharedWithOthers(initialState);

      expect(values).to.deep.equal(fromJS(sharedWithOthers));
    });
  });

  describe("getGroupOverview", () => {
    it("should return the group overview", () => {
      const values = selectors.getGroupOverview(initialState);

      expect(values).to.deep.equal(fromJS(groupOverview));
    });
  });

  describe("getCaseOverview", () => {
    it("should return the case overview", () => {
      const values = selectors.getCaseOverview(initialState);

      expect(values).to.deep.equal(fromJS(caseOverview));
    });
  });

  describe("getNationalAdminSummary", () => {
    it("should return the case overview", () => {
      const values = selectors.getNationalAdminSummary(initialState);

      expect(values).to.deep.equal(fromJS(nationalAdminSummary));
    });
  });

  describe("getSharedWithMyTeam", () => {
    it("should return the shared with my team dashboard", () => {
      const values = selectors.getSharedWithMyTeam(initialState);

      expect(values).to.deep.equal(fromJS(sharedWithMyTeam));
    });
  });

  describe("getCaseIncidentOverview", () => {
    it("should return the Overview - My Cases / Incidents dashboard", () => {
      const values = selectors.getCaseIncidentOverview(initialState);

      expect(values).to.deep.equal(fromJS(myCasesIncidents));
    });
  });

  describe("getDashboardFlags", () => {
    describe("when excludeResolved is false", () => {
      it("should return all flags", () => {
        const expected = fromJS([
          {
            message: "Reason 1",
            removed: false,
            record_type: "cases"
          },
          {
            message: "Reason 2",
            removed: true,
            record_type: "cases"
          }
        ]);

        expect(selectors.getDashboardFlags(initialState)).to.deep.equal(expected);
      });
    });

    describe("when excludeResolved is true", () => {
      it("should return all flags that are not resolve (removed === true)", () => {
        const expected = fromJS([
          {
            message: "Reason 1",
            removed: false,
            record_type: "cases"
          }
        ]);

        expect(selectors.getDashboardFlags(initialState, true)).to.deep.equal(expected);
      });
    });
  });
});
