import { fromJS } from "immutable";
import { TableHead, TableCell } from "@material-ui/core";

import { setupMountedComponent } from "../../../../../test";
import { ACTIONS } from "../../../../permissions";
import DashboardTable from "../../../../dashboard/dashboard-table";
import LoadingIndicator from "../../../../loading-indicator";

import ViolationsCategoryVerificationStatus from "./component";

describe("<WorkflowTeamCases> - pages/dashboard/components/violations-category-verification-status", () => {
  let component;
  let tableCells;

  const permissions = {
    dashboards: [ACTIONS.DASH_VIOLATIONS_CATEGORY_VERIFICATION_STATUS]
  };
  const state = fromJS({
    records: {
      dashboard: {
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
    ({ component } = setupMountedComponent(ViolationsCategoryVerificationStatus, {}, state));
    tableCells = component.find(DashboardTable).find(TableHead).find(TableCell);
  });

  it("should render a <DashboardTable /> component", () => {
    expect(component.find(DashboardTable)).to.have.lengthOf(1);
  });

  it("should render 3 columns", () => {
    expect(tableCells).to.have.lengthOf(3);
  });

  it("should render Verified column", () => {
    expect(tableCells.at(1).text()).to.equal("Verified");
  });

  it("should render Report Pending Verification column", () => {
    expect(tableCells.at(2).text()).to.equal("Report Pending Verification");
  });

  describe("when the data is loading", () => {
    const props = {
      loadingIndicator: {
        overlay: true,
        type: "NAMESPACE",
        loading: true,
        errors: false
      }
    };

    it("renders a <LoadingIndicator />", () => {
      const { component: loadingComponent } = setupMountedComponent(ViolationsCategoryVerificationStatus, props, {
        records: {
          dashboard: {
            data: [],
            loading: true
          }
        },
        user: {
          permissions
        }
      });

      expect(loadingComponent.find(LoadingIndicator)).to.have.lengthOf(1);
    });
  });
});
