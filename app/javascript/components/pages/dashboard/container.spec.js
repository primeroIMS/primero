import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../test-utils";

import Dashboard from "./container";

describe("<Dashboard />", () => {
  const initialState = fromJS({
    user: {
      reportingLocationConfig: {
        field_key: "owned_by_location",
        admin_level: 2,
        admin_level_map: { 1: ["province"], 2: ["district"] },
        label_keys: ["district"]
      }
    }
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
    mountedComponent(<Dashboard />, {}, initialState);
    expect(screen.getByText(/navigation.home/i)).toBeInTheDocument();
  });

  it("should render a <SharedFromMyTeam /> component", () => {
    mountedComponent(<Dashboard />, {}, initialState);
    expect(screen.getByText("navigation.home")).toBeInTheDocument();
  });

  it("should render a <SharedWithMyTeam /> component", () => {
    mountedComponent(<Dashboard />, {}, initialState);
    expect(screen.getByText(/navigation.home/i)).toBeInTheDocument();
  });

  it("should render a <WorkflowIndividualCases /> component", () => {
    mountedComponent(<Dashboard />, {}, initialState);
    expect(screen.getByTestId("page-heading")).toBeInTheDocument();
  });

  it("should render a <Approvals /> component", () => {
    mountedComponent(<Dashboard />, {}, initialState);
    expect(screen.getByText(/navigation.home/i)).toBeInTheDocument();
  });

  it("should render a <OverdueTasks /> component", () => {
    mountedComponent(<Dashboard />, {}, initialState);
    expect(screen.getByTestId(/page-heading/i)).toBeInTheDocument();
  });

  it("should render a <WorkflowTeamCases /> component", () => {
    mountedComponent(<Dashboard />, {}, initialState);
    expect(screen.getByText(/navigation.home/i)).toBeInTheDocument();
  });

  it("should render a <ReportingLocation /> component", () => {
    mountedComponent(<Dashboard />, {}, initialState);
    expect(screen.getByTestId(/page-heading/i)).toBeInTheDocument();
  });

  it("should render a <ProtectionConcern /> component", () => {
    mountedComponent(<Dashboard />, {}, initialState);
    expect(screen.getByText(/navigation.home/i)).toBeInTheDocument();
  });
});
