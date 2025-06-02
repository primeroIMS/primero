// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { ACTIONS } from "../../../../permissions";

import SharedWithMyTeam from "./component";

describe("<SharedWithMyTeam> - pages/dashboard/components/shared-with-my-team", () => {
  const permissions = {
    dashboards: [ACTIONS.DASH_SHARED_WITH_MY_TEAM]
  };
  const state = fromJS({
    records: {
      dashboard: {
        shared_with_my_team: {
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
      }
    },
    user: {
      permissions,
      modules: ["primeromodule-cp"]
    }
  });

  beforeEach(() => {
    mountedComponent(<SharedWithMyTeam />, state);
  });

  it("should render a <DashboardTable /> component", () => {
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("should render case_worker column", () => {
    expect(screen.getAllByText("dashboard.case_worker")[0]).toBeInTheDocument();
  });

  it("should render shared_with_my_team_referrals column", () => {
    expect(screen.getAllByText("dashboard.shared_with_my_team_referrals")[1]).toBeInTheDocument();
  });

  it("should render shared_with_my_team_pending_transfers column", () => {
    expect(screen.getAllByText("dashboard.shared_with_my_team_pending_transfers")[1]).toBeInTheDocument();
  });

  describe("when the data is loading", () => {
    it("renders a <LoadingIndicator />", () => {
      mountedComponent(<SharedWithMyTeam />, {
        records: { dashboard: { shared_with_my_team: { data: [], loading: true } } },
        user: { permissions }
      });

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });
});
