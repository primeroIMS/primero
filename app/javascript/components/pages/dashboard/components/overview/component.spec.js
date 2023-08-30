import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { ACTIONS } from "../../../../permissions";

import Overview from "./component";

describe("<Overview> - pages/dashboard/components/overview", () => {
  const permissions = fromJS({
    dashboards: [
      ACTIONS.DASH_SHARED_WITH_ME,
      ACTIONS.DASH_SHARED_WITH_OTHERS,
      ACTIONS.DASH_GROUP_OVERVIEW,
      ACTIONS.DASH_CASE_OVERVIEW
    ],
    cases: [ACTIONS.RECEIVE_REFERRAL, ACTIONS.RECEIVE_TRANSFER]
  });

  const state = fromJS({
    records: {
      dashboard: {
        data: [
          {
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
          },
          {
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
          },
          {
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
          },
          {
            name: "dashboard.case_overview",
            type: "indicator",
            indicators: {
              open: {
                count: 5,
                query: ["record_state=true", "status=open"]
              },
              closed: {
                count: 0,
                query: ["record_state=true", "status=closed"]
              }
            }
          }
        ]
      }
    },
    user: {
      permissions
    }
  });

  const props = {
    userPermissions: permissions
  };

  beforeEach(() => {
    mountedComponent(<Overview {...props} />, state);
  });

  it("should render a <OptionsBox /> component", () => {
    expect(screen.getAllByTestId("option-box")).toHaveLength(5);
  });

  it("should render a <OverviewBox /> component", () => {
    expect(screen.getAllByTestId("overview-box")).toHaveLength(4);
  });

  it("renders the dash_group_overview dashboard", () => {
    expect(screen.getByText("dashboard.dash_group_overview")).toBeInTheDocument();
  });

  it("renders the case_overview dashboard", () => {
    expect(screen.getByText("dashboard.case_overview")).toBeInTheDocument();
  });

  it("renders the shared_with_me dashboard", () => {
    expect(screen.getByText("dashboard.dash_shared_with_me")).toBeInTheDocument();
  });

  it("renders the dash_shared_with_others dashboard", () => {
    expect(screen.getByText("dashboard.dash_shared_with_others")).toBeInTheDocument();
  });

  describe("when the data is loading", () => {
    const loadingProps = {
      loadingIndicator: {
        overlay: true,
        type: "NAMESPACE",
        loading: true,
        errors: false
      },
      userPermissions: permissions
    };

    it("renders a <LoadingIndicator />", () => {
      mountedComponent(<Overview {...loadingProps} />, {
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

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });
});
