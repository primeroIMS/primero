// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { ACTIONS } from "../../../../permissions";

import SharedFromMyTeam from "./component";

describe("<SharedFromMyTeam> - pages/dashboard/components/shared-from-my-team", () => {
  const permissions = {
    dashboards: [ACTIONS.DASH_SHARED_FROM_MY_TEAM]
  };
  const state = fromJS({
    records: {
      dashboard: {
        shared_from_my_team: {
          data: [
            {
              name: "dashboard.dash_shared_from_my_team",
              type: "indicator",
              indicators: {
                shared_from_my_team_referrals: {},
                shared_from_my_team_pending_transfers: {
                  primero_cp: {
                    count: 1,
                    query: ["record_state=true", "status=open", "transfer_status=in_progress", "owned_by_groups=[1]"]
                  }
                },
                shared_from_my_team_rejected_transfers: {}
              }
            }
          ]
        }
      }
    },
    user: {
      permissions,
      modules: ["primeromodule-cp"]
    }
  });

  beforeEach(() => {
    mountedComponent(<SharedFromMyTeam />, state);
  });

  it("should render a <DashboardTable /> component", () => {
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("should render case_worker column", () => {
    expect(screen.getAllByText("dashboard.case_worker")).toBeTruthy();
  });

  it("should render shared_from_my_team_referrals column", () => {
    expect(screen.getAllByText("dashboard.shared_from_my_team_referrals")).toBeTruthy();
  });

  it("should render shared_from_my_team_pending_transfers column", () => {
    expect(screen.getAllByText("dashboard.shared_from_my_team_pending_transfers")).toBeTruthy();
  });

  it("should render shared_from_my_team_rejected_transfers column", () => {
    expect(screen.getAllByText("dashboard.shared_from_my_team_rejected_transfers")).toBeTruthy();
  });

  describe("when the data is loading", () => {
    it("renders a <LoadingIndicator />", () => {
      mountedComponent(<SharedFromMyTeam />, {
        records: { dashboard: { shared_from_my_team: { data: [], loading: true } } },
        user: {
          permissions
        }
      });

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });
});
