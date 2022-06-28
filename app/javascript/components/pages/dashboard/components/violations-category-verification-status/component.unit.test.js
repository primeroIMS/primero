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
                category_2: {
                  status_1: {
                    count: 5,
                    query: ["record_state=true", "status=status_1"]
                  },
                  status_2: {
                    count: 2,
                    query: ["record_state=true", "status=status_2"]
                  }
                },
                category_1: {
                  status_1: {
                    count: 0,
                    query: ["record_state=true", "status=status_1"]
                  },
                  status_2: {
                    count: 1,
                    query: ["record_state=true", "status=status_2"]
                  }
                },
                "": {
                  status_1: {
                    count: 0,
                    query: ["record_state=true", "status=status_1"]
                  },
                  status_2: {
                    count: 0,
                    query: ["record_state=true", "status=status_2"]
                  }
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
              { id: "status_1", display_text: { en: "Status 1" } },
              { id: "status_2", display_text: { en: "Status 2" } }
            ]
          },
          {
            id: 1,
            unique_id: "lookup-violation-type",
            name: { en: "Violation type" },
            values: [
              { id: "category_1", display_text: { en: "Category 1" } },
              { id: "category_2", display_text: { en: "Category 2" } }
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

  it("should render Status 1 column", () => {
    expect(tableCells.at(1).text()).to.equal("Status 1");
  });

  it("should render Status 2 column", () => {
    expect(tableCells.at(2).text()).to.equal("Status 2");
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
