// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { TableHead, TableCell } from "@material-ui/core";

import { setupMountedComponent } from "../../../../../test";
import { ACTIONS } from "../../../../permissions";
import DashboardTable from "../../../../dashboard/dashboard-table";
import LoadingIndicator from "../../../../loading-indicator";

import ViolationsCategoryRegion from "./component";

describe("<ViolationsCategoryRegion> - pages/dashboard/components/violations-category-region", () => {
  let component;
  let tableCells;

  const permissions = {
    dashboards: [ACTIONS.DASH_VIOLATIONS_CATEGORY_REGION]
  };
  const state = fromJS({
    records: {
      dashboard: {
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
    ({ component } = setupMountedComponent(ViolationsCategoryRegion, {}, state));
    tableCells = component.find(DashboardTable).find(TableHead).find(TableCell);
  });

  it("should render a <DashboardTable /> component", () => {
    expect(component.find(DashboardTable)).to.have.lengthOf(1);
  });

  it("should render 3 columns", () => {
    expect(tableCells).to.have.lengthOf(3);
  });

  it("should render Killing column", () => {
    expect(tableCells.at(1).text()).to.equal("Killing");
  });

  it("should render Maiming column", () => {
    expect(tableCells.at(2).text()).to.equal("Maiming");
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
      const { component: loadingComponent } = setupMountedComponent(ViolationsCategoryRegion, props, {
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
