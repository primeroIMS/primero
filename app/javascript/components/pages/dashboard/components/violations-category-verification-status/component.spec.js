// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { ACTIONS } from "../../../../permissions";

import ViolationsCategoryVerificationStatus from "./component";

describe("<WorkflowTeamCases> - pages/dashboard/components/violations-category-verification-status", () => {
  const permissions = {
    dashboards: [ACTIONS.DASH_VIOLATIONS_CATEGORY_VERIFICATION_STATUS]
  };
  const state = fromJS({
    records: {
      dashboard: {
        violations_category_verification_status: {
          data: [
            {
              name: "dashboard.dash_violations_category_verification_status",
              type: "indicator",
              indicators: {
                violations_category_verification_status: {
                  killing_verified: {
                    count: 7,
                    query: [
                      "owned_by_groups=usergroup-primero-mrm",
                      "record_state=true",
                      "status=open",
                      "killing_verified=true"
                    ]
                  },
                  killing_report_pending_verification: {
                    count: 1,
                    query: [
                      "owned_by_groups=usergroup-primero-mrm",
                      "record_state=true",
                      "status=open",
                      "killing_report_pending_verification=true"
                    ]
                  },
                  maiming_verified: {
                    count: 4,
                    query: [
                      "owned_by_groups=usergroup-primero-mrm",
                      "record_state=true",
                      "status=open",
                      "maiming_verified=true"
                    ]
                  },
                  maiming_report_pending_verification: {
                    count: 1,
                    query: [
                      "owned_by_groups=usergroup-primero-mrm",
                      "record_state=true",
                      "status=open",
                      "maiming_report_pending_verification=true"
                    ]
                  }
                }
              }
            }
          ]
        }
      }
    },
    user: {
      permissions
    },
    forms: {
      options: {
        lookups: [
          {
            id: 1,
            unique_id: "lookup-verification-status",
            name: { en: "Verification Status" },
            values: [
              { id: "verified", display_text: { en: "Verified" } },
              { id: "report_pending_verification", display_text: { en: "Report Pending Verification" } }
            ]
          },
          {
            id: 1,
            unique_id: "lookup-violation-type",
            name: { en: "Violation type" },
            values: [
              { id: "killing", display_text: { en: "Killing" } },
              { id: "maiming", display_text: { en: "Maiming" } }
            ]
          }
        ]
      }
    }
  });

  beforeEach(() => {
    mountedComponent(<ViolationsCategoryVerificationStatus />, state);
  });

  it("should render a <DashboardTable /> component", () => {
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("should render 3 columns", () => {
    expect(document.querySelectorAll("th")).toHaveLength(3);
  });

  it("should render Verified column", () => {
    expect(screen.getAllByText("Verified")).toBeTruthy();
  });

  it("should render Report Pending Verification column", () => {
    expect(screen.getAllByText("Report Pending Verification")).toBeTruthy();
  });

  describe("when the data is loading", () => {
    it("renders a <LoadingIndicator />", () => {
      mountedComponent(<ViolationsCategoryVerificationStatus />, {
        records: {
          dashboard: {
            violations_category_verification_status: { loading: true, data: [], errors: false }
          }
        },
        user: {
          permissions
        }
      });

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });
});
