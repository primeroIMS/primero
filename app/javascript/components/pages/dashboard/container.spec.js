import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../test-utils";

import Dashboard from "./container";
import { ACTIONS } from "../../permissions";

describe("<Dashboard />", () => {
  const initialState = fromJS({
    user: {
      reportingLocationConfig: {
        field_key: "owned_by_location",
        admin_level: 2,
        admin_level_map: { 1: ["province"], 2: ["district"] },
        label_keys: ["district"]
      },
      permissions: {
        dashboards: [ACTIONS.DASH_FLAGS, ACTIONS.DASH_CASE_RISK, ACTIONS.DASH_SHARED_FROM_MY_TEAM, 
          ACTIONS.DASH_CASES_BY_TASK_OVERDUE_ASSESSMENT,
        ACTIONS.DASH_CASES_BY_TASK_OVERDUE_CASE_PLAN,
        ACTIONS.DASH_CASES_BY_TASK_OVERDUE_SERVICES,
        ACTIONS.DASH_CASES_BY_TASK_OVERDUE_FOLLOWUPS,
          
          ACTIONS.DASH_APPROVALS_ASSESSMENT,
          ACTIONS.DASH_WORKFLOW_TEAM,
        ACTIONS.DASH_WORKFLOW,
        ACTIONS.DASH_REPORTING_LOCATION,
        ACTIONS.DASH_PROTECTION_CONCERNS]
      }
    },
  });

  it("should render a <PageContainer /> component", () => {
    mountedComponent(<Dashboard />, {}, initialState);
    expect(screen.getAllByTestId("page-heading")).toHaveLength(1);
  });

  it("should render a navigation title", () => {
    mountedComponent(<Dashboard />, {}, initialState);
    expect(screen.getByText("navigation.home")).toBeInTheDocument();
  });

  it("should render a <PageContent /> component", () => {
    mountedComponent(<Dashboard />, {}, initialState);
    expect(screen.getByTestId("page-heading")).toBeInTheDocument();
  });

  it("should render a dashboard overview component", () => {
    mountedComponent(<Dashboard />, initialState);
    expect(screen.getByText(/dashboard.overview/i)).toBeInTheDocument();
  });

  it("should render a <SharedFromMyTeam /> component", () => {
    mountedComponent(<Dashboard />, initialState);
    expect(screen.queryAllByText(/dashboard.dash_shared_from_my_team/i)).toHaveLength(3);
  });

  it("should render a <SharedWithMyTeam /> component", () => {
    mountedComponent(<Dashboard />, initialState);
    expect(screen.queryAllByText(/dashboard.dash_shared_with_my_team/i)).toHaveLength(3);
  });

  it("should render a <WorkflowIndividualCases /> component", () => {
    mountedComponent(<Dashboard />, initialState);
    expect(screen.queryAllByText(/dashboard.workflow/i)).toHaveLength(4);
  });

  it("should render a <Approvals /> component", () => {
    mountedComponent(<Dashboard />, initialState);
    expect(screen.getByText(/dashboard.approvals/i)).toBeInTheDocument();
  });

  it("should render a <OverdueTasks /> component", () => {
    mountedComponent(<Dashboard />, initialState);
    expect(screen.getByText(/dashboard.approvals/i)).toBeInTheDocument();
  });

  it("should render a <WorkflowTeamCases /> component", () => {
    mountedComponent(<Dashboard />, initialState);
    expect(screen.queryAllByText(/dashboard.workflow_team/i)).toHaveLength(3);
  });

  it("should render a <ReportingLocation /> component", () => {
    mountedComponent(<Dashboard /> ,initialState);
    expect(screen.getByText(/dashboard.overview/i)).toBeInTheDocument();
  });

  it("should render a <ProtectionConcern /> component", () => {
    mountedComponent(<Dashboard />, initialState);
    expect(screen.queryAllByText(/dashboard.protection_concerns/i)).toHaveLength(3);
  });
});
