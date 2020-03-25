import { fromJS } from "immutable";
import { TableRow, TableBody } from "@material-ui/core";

import { expect, setupMountedComponent } from "../../../../../test";
import { ACTIONS } from "../../../../../libs/permissions";
import { DashboardTable, OptionsBox } from "../../../../dashboard";
import { LoadingIndicator } from "../../../../loading-indicator";

import ReportingLocation from "./component";

describe("<ReportingLocation> - pages/dashboard/components/reporting-location", () => {
  let component;
  const permissions = {
    dashboards: [ACTIONS.DASH_REPORTING_LOCATION]
  };

  const state = fromJS({
    records: {
      dashboard: {
        data: [
          {
            name: "dashboard.reporting_location",
            type: "indicator",
            indicators: {
              reporting_location_open: {
                "1506060": {
                  count: 1,
                  query: [
                    "record_state=true",
                    "status=open",
                    "owned_by_location2=1506060"
                  ]
                }
              },
              reporting_location_open_last_week: {
                "1506060": {
                  count: 0,
                  query: [
                    "record_state=true",
                    "status=open",
                    "created_at=2019-12-25T00:00:00Z..2019-12-31T23:59:59Z",
                    "owned_by_location2=1506060"
                  ]
                }
              },
              reporting_location_open_this_week: {
                "1506060": {
                  count: 1,
                  query: [
                    "record_state=true",
                    "status=open",
                    "created_at=2020-01-01T00:00:00Z..2020-01-08T19:32:20Z",
                    "owned_by_location2=1506060"
                  ]
                }
              },
              reporting_location_closed_last_week: {
                "1506060": {
                  count: 0,
                  query: [
                    "record_state=true",
                    "status=closed",
                    "created_at=2019-12-25T00:00:00Z..2019-12-31T23:59:59Z",
                    "owned_by_location2=1506060"
                  ]
                }
              },
              reporting_location_closed_this_week: {
                "1506060": {
                  count: 0,
                  query: [
                    "record_state=true",
                    "status=closed",
                    "created_at=2020-01-01T00:00:00Z..2020-01-08T19:32:20Z",
                    "owned_by_location2=1506060"
                  ]
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
    ({ component } = setupMountedComponent(ReportingLocation, {}, state));
  });

  it("should render an <OptionsBoxOptionsBox /> component", () => {
    expect(component.find(OptionsBox)).to.have.lengthOf(1);
  });

  it("should render a <DasboardTable /> component", () => {
    expect(
      component
        .find({ title: "cases.label" })
        .find(DashboardTable)
        .find(TableBody)
        .find(TableRow)
    ).to.have.lengthOf(1);
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
        ReportingLocation,
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
