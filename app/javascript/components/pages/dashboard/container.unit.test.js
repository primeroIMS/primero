import { expect } from "chai";
import "test/test.setup";
import { setupMountedComponent } from "test";
import { fromJS, Map } from "immutable";
import { TableRow, TableBody } from '@material-ui/core';
import { OverviewBox } from "components/dashboard/overview-box";
import { FlagBox } from "components/dashboard/flag-box";
import { FlagList } from "components/dashboard/flag-list";
import { DoughnutChart } from "components/dashboard/doughnut-chart";
import { LineChart } from "components/dashboard/line-chart";
import { DashboardTable } from "components/dashboard/dashboard-table";
import Dashboard from "./container";

describe("<Dashboard />", () => {
  let component;

  before(() => {
    component = setupMountedComponent(
      Dashboard,
      {},
      Map({
        Dashboard: {
          flags: fromJS({
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
          }),
          casesByStatus: fromJS({
            open: "2660451",
            closed: "1547"
          }),
          casesRegistration: fromJS({
            jan: 100,
            feb: 100
          }),
          casesByCaseWorker: fromJS([{
            case_worker: "Case Worker 1",
            assessment: "2",
            case_plan: "1",
            follow_up: "0",
            services: "1"
          }]),
          casesOverview: fromJS({
            transfers: 4,
            waiting: 1,
            pending: 1,
            rejected: 1
          })
        },
      })
    ).component;
  });

  it("renders the OverviewBox", () => {
    expect(component.find(OverviewBox)).to.have.length(1);
  });

  it("renders the FlagList", () => {
    expect(component.find(FlagList)).to.have.length(1);
  });

  it("renders the FlagBox", () => {
    expect(component.find(FlagList).find(FlagBox)).to.have.length(2);
  });

  it("renders the Doughnut chart", () => {
    expect(component.find(DoughnutChart)).to.have.length(1);
  });

  it("renders the Line chart", () => {
    expect(component.find(LineChart)).to.have.length(1);
  });

  it("renders the Table", () => {
    expect(component.find(DashboardTable)).to.have.length(2);
  });

  it("renders only one TableRow in the TableBody", () => {
    expect(component.find(TableBody).find(TableRow)).to.have.length(2);
  });
});
