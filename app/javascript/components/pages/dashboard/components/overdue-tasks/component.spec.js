// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../../test-utils";
import { ACTIONS } from "../../../../permissions";

import OverdueTasks from "./component";

describe("<OverdueTasks> - pages/dashboard/components/overdue-tasks", () => {
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
        overdue_tasks: {
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
      }
    },
    user: {
      permissions
    }
  });

  it("should render a <DashboardTable /> component", () => {
    mountedComponent(<OverdueTasks />, state);
    expect(screen.getByTestId("dashboard-table")).toBeInTheDocument();
  });

  it("should render 5 columns", () => {
    mountedComponent(<OverdueTasks />, state);
    expect(screen.getAllByRole("cell")).toHaveLength(5);
  });

  it("should render case_worker column", () => {
    mountedComponent(<OverdueTasks />, state);
    expect(screen.getAllByText("dashboard.case_worker")).toHaveLength(2);
  });

  it("should render assessment column", () => {
    mountedComponent(<OverdueTasks />, state);
    expect(screen.getAllByText("dashboard.assessment")).toHaveLength(2);
  });

  it("should render case_plan column", () => {
    mountedComponent(<OverdueTasks />, state);
    expect(screen.getAllByText("dashboard.case_plan")).toHaveLength(2);
  });

  it("should render services column", () => {
    mountedComponent(<OverdueTasks />, state);
    expect(screen.getAllByText("dashboard.services")).toHaveLength(2);
  });

  it("should render follow_up column", () => {
    mountedComponent(<OverdueTasks />, state);
    expect(screen.getAllByText("dashboard.follow_up")).toHaveLength(2);
  });

  describe("when the data is loading", () => {
    it("renders a <LoadingIndicator />", () => {
      mountedComponent(<OverdueTasks />, {
        records: { dashboard: { overdue_tasks: { data: [], loading: true } } },
        user: { permissions }
      });
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });
});
