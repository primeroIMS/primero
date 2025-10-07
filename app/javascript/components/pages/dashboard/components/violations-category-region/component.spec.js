// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { ACTIONS } from "../../../../permissions";

import ViolationsCategoryRegion from "./component";

describe("<ViolationsCategoryRegion> - pages/dashboard/components/violations-category-region", () => {
  let tableCells;

  const permissions = {
    dashboards: [ACTIONS.DASH_VIOLATIONS_CATEGORY_REGION]
  };
  const state = fromJS({
    records: {
      dashboard: {
        violations_category_region: {
          data: [
            {
              name: "dashboard.dash_violations_category_region",
              type: "indicator",
              indicators: {
                violations_category_region: {
                  region_1: {
                    killing_verified: {
                      count: 5,
                      query: ["record_state=true", "category=killing_verified"]
                    },
                    maiming_verified: {
                      count: 2,
                      query: ["record_state=true", "category=maiming_verified"]
                    }
                  },
                  region_2: {
                    killing_verified: {
                      count: 0,
                      query: ["record_state=true", "category=killing_verified"]
                    },
                    maiming_verified: {
                      count: 1,
                      query: ["record_state=true", "category=maiming_verified"]
                    }
                  },
                  "": {
                    killing_verified: {
                      count: 0,
                      query: ["record_state=true", "category=killing_verified"]
                    },
                    maiming_verified: {
                      count: 0,
                      query: ["record_state=true", "category=maiming_verified"]
                    }
                  }
                }
              }
            }
          ]
        }
      }
    },
    user: {
      permissions
    },
    forms: {
      options: {
        lookups: [
          {
            id: 1,
            unique_id: "lookup-violation-type",
            name: { en: "Violation type" },
            values: [
              { id: "killing", display_text: { en: "Killing" } },
              { id: "maiming", display_text: { en: "Maiming" } }
            ]
          }
        ],
        locations: [
          {
            id: 1,
            code: "country",
            type: "country",
            admin_level: 0,
            names: { en: "Country" }
          },
          {
            id: 2,
            code: "region_1",
            type: "region",
            admin_level: 1,
            names: { en: "Country::Region 1" }
          },
          {
            id: 3,
            code: "region_2",
            type: "region",
            admin_level: 1,
            names: { en: "Country::Region 2" }
          }
        ]
      }
    }
  });

  beforeEach(() => {
    mountedComponent(<ViolationsCategoryRegion />, state);
  });

  it("should render a <DashboardTable /> component", () => {
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  xit("should render 3 columns", () => {
    expect(tableCells).toHaveLength(3);
  });

  it("should render Killing column", () => {
    expect(screen.getAllByText("Killing")).toBeTruthy();
  });

  it("should render Maiming column", () => {
    expect(screen.getAllByText("Maiming")).toBeTruthy();
  });

  describe("when the data is loading", () => {
    it("renders a <LoadingIndicator />", () => {
      mountedComponent(<ViolationsCategoryRegion />, {
        records: { dashboard: { violations_category_region: { data: [], loading: true } } },
        user: { permissions }
      });

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });
});
