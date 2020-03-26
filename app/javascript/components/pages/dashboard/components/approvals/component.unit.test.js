import { fromJS } from "immutable";

import { expect, setupMountedComponent } from "../../../../../test";
import {
  ACTIONS,
  DASH_APPROVALS_PENDING
} from "../../../../../libs/permissions";
import { OverviewBox, OptionsBox } from "../../../../dashboard";
import { LoadingIndicator } from "../../../../loading-indicator";

import Approvals from "./component";

describe("<Approvals> - pages/dashboard/components/reporting-location", () => {
  let component;

  const permissions = {
    dashboards: [
      ACTIONS.DASH_APPROVALS_ASSESSMENT,
      ACTIONS.DASH_APPROVALS_CASE_PLAN,
      ACTIONS.DASH_APPROVALS_CLOSURE,
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
                count: 1,
                query: []
              }
            }
          },
          {
            name: "dashboard.approvals_closure",
            type: "indicator",
            indicators: {
              approval_closure_pending: {
                count: 1,
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
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(Approvals, {}, state));
  });

  it("should render 5 <OptionsBox /> component", () => {
    expect(component.find(OptionsBox)).to.have.lengthOf(5);
  });

  it("should render 4 <OverviewBox /> component", () => {
    expect(component.find(OverviewBox)).to.have.lengthOf(4);
    expect(component.find("li")).to.have.lengthOf(4);
    expect(component.find("button")).to.have.lengthOf(4);
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
        Approvals,
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
