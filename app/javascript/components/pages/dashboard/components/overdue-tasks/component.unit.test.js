import { fromJS } from "immutable";
import { TableHead, TableCell } from "@material-ui/core";

import { expect, setupMountedComponent } from "../../../../../test";
import { ACTIONS } from "../../../../../libs/permissions";
import { DashboardTable } from "../../../../dashboard/dashboard-table";
import { LoadingIndicator } from "../../../../loading-indicator";

import OverdueTasks from "./component";

describe("<OverdueTasks> - pages/dashboard/components/overdue-tasks", () => {
  let component;
  let tableCells;

  const permissions = {
    dashboards: [
      ACTIONS.DASH_CASES_BY_TASK_OVERDUE_ASSESSMENT,
      ACTIONS.DASH_CASES_BY_TASK_OVERDUE_CASE_PLAN,
      ACTIONS.DASH_CASES_BY_TASK_OVERDUE_SERVICES,
      ACTIONS.DASH_CASES_BY_TASK_OVERDUE_FOLLOWUPS
    ]
  };
  const state = fromJS({
    records: {
      dashboard: {
        data: [
          {
            name: "dashboard.cases_by_task_overdue_assessment",
            type: "indicator",
            indicators: {
              tasks_overdue_assessment: {
                primero: {
                  count: 0,
                  query: ["record_state=true"]
                }
              }
            }
          },
          {
            name: "dashboard.cases_by_task_overdue_case_plan",
            type: "indicator",
            indicators: {
              tasks_overdue_case_plan: {
                primero: {
                  count: 0,
                  query: ["record_state=true"]
                }
              }
            }
          },
          {
            name: "dashboard.cases_by_task_overdue_services",
            type: "indicator",
            indicators: {
              tasks_overdue_services: {
                primero: {
                  count: 0,
                  query: ["record_state=true"]
                }
              }
            }
          },
          {
            name: "dashboard.cases_by_task_overdue_followups",
            type: "indicator",
            indicators: {
              tasks_overdue_followups: {
                primero: {
                  count: 0,
                  query: ["record_state=true"]
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
    ({ component } = setupMountedComponent(OverdueTasks, {}, state));
    tableCells = component.find(DashboardTable).find(TableHead).find(TableCell);
  });

  it("should render a <DashboardTable /> component", () => {
    expect(component.find(DashboardTable)).to.have.lengthOf(1);
  });

  it("should render 5 columns", () => {
    expect(tableCells).to.have.lengthOf(5);
  });

  it("should render case_worker column", () => {
    expect(tableCells.at(0).text()).to.equal("dashboard.case_worker");
  });

  it("should render assessment column", () => {
    expect(tableCells.at(1).text()).to.equal("dashboard.assessment");
  });

  it("should render case_plan column", () => {
    expect(tableCells.at(2).text()).to.equal("dashboard.case_plan");
  });

  it("should render services column", () => {
    expect(tableCells.at(3).text()).to.equal("dashboard.services");
  });

  it("should render follow_up column", () => {
    expect(tableCells.at(4).text()).to.equal("dashboard.follow_up");
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
        OverdueTasks,
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
