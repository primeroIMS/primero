import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../../test";
import { ACTIONS, DASH_APPROVALS_PENDING } from "../../../../../libs/permissions";
import { OverviewBox, OptionsBox } from "../../../../dashboard";
import LoadingIndicator from "../../../../loading-indicator";

import Approvals from "./component";

describe("<Approvals> - pages/dashboard/components/reporting-location", () => {
  let component;

  const permissions = {
    dashboards: [
      ACTIONS.DASH_APPROVALS_ASSESSMENT,
      ACTIONS.DASH_APPROVALS_CASE_PLAN,
      ACTIONS.DASH_APPROVALS_CLOSURE,
      ACTIONS.DASH_APPROVALS_ACTION_PLAN,
      ACTIONS.DASH_APPROVALS_GBV_CLOSURE,
      DASH_APPROVALS_PENDING
    ]
  };
  const state = fromJS({
    records: {
      dashboard: {
        data: [
          {
            name: "dashboard.approvals_assessment",
            type: "indicator",
            indicators: {
              approval_assessment_pending: {
                count: 1,
                query: []
              }
            }
          },
          {
            name: "dashboard.approvals_case_plan",
            type: "indicator",
            indicators: {
              approval_case_plan_pending: {
                count: 2,
                query: []
              }
            }
          },
          {
            name: "dashboard.approvals_closure",
            type: "indicator",
            indicators: {
              approval_closure_pending: {
                count: 3,
                query: []
              }
            }
          },
          {
            name: "dashboard.approvals_action_plan",
            type: "indicator",
            indicators: {
              approval_action_plan_pending: {
                count: 4,
                query: []
              }
            }
          },
          {
            name: "dashboard.approvals_gbv_closure",
            type: "indicator",
            indicators: {
              approval_gbv_closure_pending: {
                count: 5,
                query: []
              }
            }
          },
          {
            name: "dashboard.approvals_assessment_pending",
            type: "indicator",
            indicators: {
              approval_assessment_pending_group: {
                count: 1,
                query: []
              }
            }
          }
        ]
      }
    },
    user: {
      permissions
    },
    application: {
      approvalsLabels: {
        assessment: {
          en: "Assessment"
        },
        case_plan: {
          en: "Case Plan"
        },
        closure: {
          en: "Closure"
        },
        action_plan: {
          en: "Action Plan"
        },
        gbv_closure: {
          en: "GBV Closure"
        }
      }
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(Approvals, {}, state));
  });

  it("should render 6 <OptionsBox /> component", () => {
    expect(component.find(OptionsBox)).to.have.lengthOf(6);
  });

  it("should render 5 <OverviewBox /> component", () => {
    expect(component.find(OverviewBox)).to.have.lengthOf(5);
    expect(component.find("a")).to.have.lengthOf(5);
  });

  it("should render the correct approvals label", () => {
    expect(component.find(OverviewBox).at(0).text()).to.contain("1 Assessment");
    expect(component.find(OverviewBox).at(1).text()).to.contain("2 Case Plan");
    expect(component.find(OverviewBox).at(2).text()).to.contain("3 Closure");
    expect(component.find(OverviewBox).at(3).text()).to.contain("4 Action Plan");
    expect(component.find(OverviewBox).at(4).text()).to.contain("5 GBV Closure");
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
      const { component: loadingComponent } = setupMountedComponent(Approvals, props, {
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
