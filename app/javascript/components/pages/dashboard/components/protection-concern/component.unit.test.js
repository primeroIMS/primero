import { fromJS } from "immutable";
import { TableRow, TableBody } from "@material-ui/core";

import { expect, setupMountedComponent } from "../../../../../test";
import { ACTIONS } from "../../../../../libs/permissions";
import { DashboardTable, OptionsBox } from "../../../../dashboard";
import { LoadingIndicator } from "../../../../loading-indicator";

import ProtectionConcern from "./component";

describe("<ProtectionConcern> - pages/dashboard/components/protection-concern", () => {
  let component;
  const permissions = {
    dashboards: [ACTIONS.DASH_PROTECTION_CONCERNS]
  };

  const state = fromJS({
    records: {
      dashboard: {
        data: [
          {
            name: "dashboard.dash_protection_concerns",
            type: "indicator",
            indicators: {
              protection_concerns_open_cases: {
                statelessness: {
                  count: 2,
                  query: []
                }
              },
              protection_concerns_new_this_week: {
                statelessness: {
                  count: 1,
                  query: []
                }
              },
              protection_concerns_all_cases: {
                statelessness: {
                  count: 4,
                  query: []
                }
              },
              protection_concerns_closed_this_week: {
                statelessness: {
                  count: 1,
                  query: []
                }
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
    ({ component } = setupMountedComponent(ProtectionConcern, {}, state));
  });

  it("should render an <OptionsBoxOptionsBox /> component", () => {
    expect(component.find(OptionsBox)).to.have.lengthOf(1);
  });

  it("should render a <DasboardTable /> component", () => {
    expect(component.find(DashboardTable)).to.have.lengthOf(1);
    expect(component.find(TableBody)).to.have.lengthOf(1);
    expect(component.find(TableBody).find(TableRow)).to.have.lengthOf(1);
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
        ProtectionConcern,
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
