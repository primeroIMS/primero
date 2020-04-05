import { fromJS } from "immutable";
import { TableHead, TableCell } from "@material-ui/core";

import { expect, setupMountedComponent } from "../../../../../test";
import { ACTIONS } from "../../../../../libs/permissions";
import DashboardTable from "../../../../dashboard/dashboard-table";
import LoadingIndicator from "../../../../loading-indicator";

import SharedFromMyTeam from "./component";

describe("<SharedFromMyTeam> - pages/dashboard/components/shared-from-my-team", () => {
  let component;
  let tableCells;

  const permissions = {
    dashboards: [ACTIONS.DASH_SHARED_FROM_MY_TEAM]
  };
  const state = fromJS({
    records: {
      dashboard: {
        data: [
          {
            name: "dashboard.dash_shared_from_my_team",
            type: "indicator",
            indicators: {
              shared_from_my_team_referrals: {},
              shared_from_my_team_pending_transfers: {
                primero_cp: {
                  count: 1,
                  query: [
                    "record_state=true",
                    "status=open",
                    "transfer_status=in_progress",
                    "owned_by_groups=[1]"
                  ]
                }
              },
              shared_from_my_team_rejected_transfers: {}
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
    ({ component } = setupMountedComponent(SharedFromMyTeam, {}, state));
    tableCells = component.find(DashboardTable).find(TableHead).find(TableCell);
  });

  it("should render a <DashboardTable /> component", () => {
    expect(component.find(DashboardTable)).to.have.lengthOf(1);
  });

  it("should render 4 columns", () => {
    expect(tableCells).to.have.lengthOf(4);
  });

  it("should render case_worker column", () => {
    expect(tableCells.at(0).text()).to.equal("dashboard.case_worker");
  });

  it("should render shared_from_my_team_referrals column", () => {
    expect(tableCells.at(1).text()).to.equal(
      "dashboard.shared_from_my_team_referrals"
    );
  });

  it("should render shared_from_my_team_pending_transfers column", () => {
    expect(tableCells.at(2).text()).to.equal(
      "dashboard.shared_from_my_team_pending_transfers"
    );
  });

  it("should render shared_from_my_team_rejected_transfers column", () => {
    expect(tableCells.at(3).text()).to.equal(
      "dashboard.shared_from_my_team_rejected_transfers"
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
        SharedFromMyTeam,
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
