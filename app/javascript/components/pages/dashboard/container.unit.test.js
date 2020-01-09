import { expect } from "chai";
import { fromJS } from "immutable";
import { TableRow, TableBody } from "@material-ui/core";

import { setupMountedComponent } from "../../../test";
import { OverviewBox } from "../../dashboard/overview-box";
import { FlagBox } from "../../dashboard/flag-box";
import { FlagList } from "../../dashboard/flag-list";
import { DoughnutChart } from "../../dashboard/doughnut-chart";
import { LineChart } from "../../dashboard/line-chart";
import { DashboardTable } from "../../dashboard/dashboard-table";
import { BadgedIndicator } from "../../dashboard/badged-indicator";
import { PieChart } from "../../dashboard/pie-chart";
import { ACTIONS } from "../../../libs/permissions";

import Dashboard from "./container";
import { TableBodyRow } from "mui-datatables";

describe("<Dashboard />", () => {
  let component;

  before(() => {
    ({ component } = setupMountedComponent(
      Dashboard,
      {},
      fromJS({
        application: {
          reportingLocationConfig: {
            label_key: "district",
            admin_level: 2,
            field_key: "owned_by_location"
          }
        },
        forms: {
          options: {
            locations: [
              {
                id: 1,
                code: "1506060",
                type: "sub_district",
                name: { en: "My District" }
              }
            ]
          }
        },
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
            ],
            flags: {
              flags: [
                {
                  id: "#1234",
                  flag_date: "01/01/2019",
                  user: "CP Admin",
                  status: "Please check approval"
                },
                {
                  id: "#1235",
                  flag_date: "01/01/2019",
                  user: "CP Manager",
                  status: "To followup"
                }
              ],
              totalCount: 0
            },
            casesByStatus: {
              open: "2660451",
              closed: "1547"
            },
            casesRegistration: {
              jan: 100,
              feb: 100
            },
            casesByCaseWorker: [
              {
                case_worker: "Case Worker 1",
                assessment: "2",
                case_plan: "1",
                follow_up: "0",
                services: "1"
              }
            ],
            casesOverview: {
              transfers: 4,
              waiting: 1,
              pending: 1,
              rejected: 1
            }
          }
        },
        user: {
          permissions: {
            dashboards: [
              ACTIONS.DASH_CASE_RISK,
              ACTIONS.DASH_WORKFLOW,
              ACTIONS.DASH_WORKFLOW_TEAM,
              ACTIONS.DASH_REPORTING_LOCATION
            ]
          }
        }
      })
    ));
  });

  it("renders the OverviewBox", () => {
    expect(component.find(OverviewBox)).to.have.lengthOf(1);
  });

  it("renders the FlagList", () => {
    expect(component.find(FlagList)).to.have.lengthOf(1);
  });

  it("renders the FlagBox", () => {
    expect(component.find(FlagList).find(FlagBox)).to.have.lengthOf(2);
  });

  it("renders the Doughnut chart", () => {
    expect(component.find(DoughnutChart)).to.have.lengthOf(1);
  });

  it("renders the Line chart", () => {
    expect(component.find(LineChart)).to.have.lengthOf(1);
  });

  it("renders the Table", () => {
    expect(component.find(DashboardTable)).to.have.lengthOf(2);
  });

  it("renders only one TableRow in the TableBody", () => {
    expect(component.find(TableBody).find(TableRow)).to.have.lengthOf(2);
  });

  it("renders the BadgedIndicator", () => {
    expect(component.find(BadgedIndicator)).to.have.lengthOf(1);
  });

  it("renders the PieChart", () => {
    expect(component.find(PieChart)).to.have.lengthOf(1);
  });

  it("renders the DashboardTable", () => {
    expect(component.find(DashboardTable)).to.have.lengthOf(1);
  });

  it("renders the Reporting Location Table", () => {
    expect(
      component
        .find({ title: "cases.label" })
        .find(DashboardTable)
        .find(TableBody)
        .find(TableRow)
    ).to.have.lengthOf(1);
  });
});
