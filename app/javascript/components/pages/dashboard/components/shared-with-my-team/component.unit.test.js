import { fromJS } from "immutable";
import { TableHead, TableCell } from "@material-ui/core";

import { expect, setupMountedComponent } from "../../../../../test";
import { ACTIONS } from "../../../../../libs/permissions";
import { DashboardTable } from "../../../../dashboard/dashboard-table";
import { LoadingIndicator } from "../../../../loading-indicator";
import { PrimeroModuleRecord } from "../../../../application/records";

import SharedWithMyTeam from "./component";

describe("<SharedWithMyTeam> - pages/dashboard/components/shared-with-my-team", () => {
  let component;
  let tableCells;

  const permissions = {
    dashboards: [ACTIONS.DASH_SHARED_WITH_MY_TEAM]
  };
  const state = fromJS({
    records: {
      dashboard: {
        data: [
          {
            name: "dashboard.dash_shared_with_my_team",
            type: "indicator",
            indicators: {
              shared_with_my_team_referrals: {},
              shared_with_my_team_pending_transfers: {
                primero_cp: {
                  count: 1,
                  query: ["transferred_to_users = primero_cp"]
                }
              }
            }
          }
        ]
      }
    },
    user: {
      permissions,
      modules: ["primeromodule-cp"]
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(SharedWithMyTeam, {}, state));
    tableCells = component.find(DashboardTable).find(TableHead).find(TableCell);
  });

  it("should render a <DashboardTable /> component", () => {
    expect(component.find(DashboardTable)).to.have.lengthOf(1);
  });

  it("should render 3 columns", () => {
    expect(tableCells).to.have.lengthOf(3);
  });

  it("should render case_worker column", () => {
    expect(tableCells.at(0).text()).to.equal("dashboard.case_worker");
  });

  it("should render shared_with_my_team_referrals column", () => {
    expect(tableCells.at(1).text()).to.equal(
      "dashboard.shared_with_my_team_referrals"
    );
  });

  it("should render shared_with_my_team_pending_transfers column", () => {
    expect(tableCells.at(2).text()).to.equal(
      "dashboard.shared_with_my_team_pending_transfers"
    );
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
      const { component: loadingComponent } = setupMountedComponent(
        SharedWithMyTeam,
        props,
        {
          records: {
            dashboard: {
              data: [],
              loading: true
            }
          },
          user: {
            permissions
          }
        }
      );

      expect(loadingComponent.find(LoadingIndicator)).to.have.lengthOf(1);
    });
  });
});
