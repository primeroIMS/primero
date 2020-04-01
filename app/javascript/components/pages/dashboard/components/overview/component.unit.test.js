import { fromJS } from "immutable";

import { expect, setupMountedComponent } from "../../../../../test";
import { ACTIONS } from "../../../../../libs/permissions";
import { OptionsBox, OverviewBox } from "../../../../dashboard";
import { LoadingIndicator } from "../../../../loading-indicator";

import Overview from "./component";

describe("<Overview> - pages/dashboard/components/overview", () => {
  let component;

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
                query: [
                  "record_state=true",
                  "status=open",
                  "not_edited_by_owner=true"
                ]
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
                query: [
                  "owned_by=primero_cp",
                  "record_state=true",
                  "status=open",
                  "referred_users_present=true"
                ]
              },
              shared_with_others_pending_transfers: {
                count: 0,
                query: [
                  "owned_by=primero_cp",
                  "record_state=true",
                  "status=open",
                  "transfer_status=in_progress"
                ]
              },
              shared_with_others_rejected_transfers: {
                count: 0,
                query: [
                  "owned_by=primero_cp",
                  "record_state=true",
                  "status=open",
                  "transfer_status=rejected"
                ]
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
    ({ component } = setupMountedComponent(Overview, props, state));
  });

  it("should render a <OptionsBox /> component", () => {
    expect(component.find(OptionsBox)).to.have.lengthOf(5);
  });

  it("should render a <OverviewBox /> component", () => {
    expect(component.find(OverviewBox)).to.have.lengthOf(4);
  });

  it("renders the dash_group_overview dashboard", () => {
    const groupOverview = component.find(OverviewBox).at(0);

    expect(groupOverview.find("div div").text()).to.be.equal(
      "dashboard.dash_group_overview"
    );
    expect(groupOverview.find("div").find("ul li")).to.have.lengthOf(2);
  });

  it("renders the case_overview dashboard", () => {
    const caseOverview = component.find(OverviewBox).at(1);

    expect(caseOverview.find("div div").text()).to.be.equal(
      "dashboard.case_overview"
    );
    expect(caseOverview.find("div").find("ul li")).to.have.lengthOf(2);
  });

  it("renders the shared_with_me dashboard", () => {
    const sharedWithMe = component.find(OverviewBox).at(2);

    expect(sharedWithMe.find("div div").text()).to.be.equal(
      "dashboard.dash_shared_with_me"
    );
    expect(sharedWithMe.find("div").find("ul li")).to.have.lengthOf(3);
  });

  it("renders the dash_shared_with_others dashboard", () => {
    const sharedWithOthers = component.find(OverviewBox).at(3);

    expect(sharedWithOthers.find("div div").text()).to.be.equal(
      "dashboard.dash_shared_with_others"
    );
    expect(sharedWithOthers.find("div").find("ul li")).to.have.lengthOf(3);
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
      const { component: loadingComponent } = setupMountedComponent(
        Overview,
        loadingProps,
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
