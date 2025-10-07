// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { ACTIONS } from "../../../../permissions";

import ReportingLocation from "./component";

describe("<ReportingLocation> - pages/dashboard/components/reporting-location", () => {
  const permissions = {
    dashboards: [ACTIONS.DASH_REPORTING_LOCATION]
  };

  const state = fromJS({
    records: {
      dashboard: {
        reporting_location: {
          data: [
            {
              name: "dashboard.reporting_location",
              type: "indicator",
              indicators: {
                reporting_location_open: {
                  1506060: {
                    count: 1,
                    query: ["record_state=true", "status=open", "owned_by_location2=1506060"]
                  }
                },
                reporting_location_open_last_week: {
                  1506060: {
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
                  1506060: {
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
                  1506060: {
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
                  1506060: {
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
      }
    },
    user: {
      permissions,
      reportingLocationConfig: {
        field_key: "owned_by_location",
        admin_level: 2,
        admin_level_map: { 1: ["province"], 2: ["district"] },
        label_keys: ["district"]
      }
    }
  });

  beforeEach(() => {
    mountedComponent(<ReportingLocation />, state);
  });

  it("should render an <OptionsBoxOptionsBox /> component", () => {
    expect(screen.getByTestId("option-box")).toBeInTheDocument();
  });

  it("should render a <DasboardTable /> component", () => {
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  describe("when the data is loading", () => {
    it("renders a <LoadingIndicator />", () => {
      mountedComponent(<ReportingLocation />, {
        records: { dashboard: { reporting_location: { data: [], loading: true } } },
        user: {
          permissions,
          reportingLocationConfig: {
            field_key: "owned_by_location",
            admin_level: 2,
            admin_level_map: { 1: ["province"], 2: ["district"] },
            label_keys: ["district"]
          }
        }
      });

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });
});
