import { expect } from "chai";

import { setupMountedComponent } from "../../../test";
import { fromJS } from "immutable";
import { TableRow, TableBody } from "@material-ui/core";
import { OverviewBox } from "../../dashboard/overview-box";
import { FlagBox } from "../../dashboard/flag-box";
import { FlagList } from "../../dashboard/flag-list";
import { DoughnutChart } from "../../dashboard/doughnut-chart";
import { LineChart } from "../../dashboard/line-chart";
import { DashboardTable } from "../../dashboard/dashboard-table";
import Dashboard from "./container";

describe("<Dashboard />", () => {
  let component;

  before(() => {
    ({ component } = setupMountedComponent(
      Dashboard,
      {},
      fromJS({
        records: {
          dashboard: {
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
});
