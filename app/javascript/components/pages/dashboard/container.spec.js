import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../test-utils";
import { ACTIONS } from "../../permissions";
import { PrimeroModuleRecord } from "../../application/records";

import Dashboard from "./container";

describe("<Dashboard />", () => {
  describe("when a user has dashboards", () => {
    const reportingLocationConfig = {
      field_key: "owned_by_location",
      admin_level: 2,
      admin_level_map: { 1: ["province"], 2: ["district"] },
      label_keys: ["district"]
    };
    const initialState = fromJS({
      user: {
        reportingLocationConfig,
        modules: ["cp"],
        permissions: {
          dashboards: [
            ACTIONS.DASH_CASE_OVERVIEW,
            ACTIONS.DASH_FLAGS,
            ACTIONS.DASH_CASE_RISK,
            ACTIONS.DASH_SHARED_FROM_MY_TEAM,
            ACTIONS.DASH_CASES_BY_TASK_OVERDUE_ASSESSMENT,
            ACTIONS.DASH_CASES_BY_TASK_OVERDUE_CASE_PLAN,
            ACTIONS.DASH_CASES_BY_TASK_OVERDUE_SERVICES,
            ACTIONS.DASH_CASES_BY_TASK_OVERDUE_FOLLOWUPS,
            ACTIONS.DASH_APPROVALS_ASSESSMENT,
            ACTIONS.DASH_WORKFLOW_TEAM,
            ACTIONS.DASH_WORKFLOW,
            ACTIONS.DASH_REPORTING_LOCATION,
            ACTIONS.DASH_PROTECTION_CONCERNS
          ]
        }
      },
      application: {
        modules: [
          PrimeroModuleRecord({
            unique_id: "cp",
            name: "CP",
            workflows: {
              case: [{ id: "new", display_text: { en: "New" } }]
            }
          })
        ]
      }
    });

    beforeEach(() => {
      mountedComponent(<Dashboard />, initialState);
    });

    it("should render a <PageContainer /> component", () => {
      expect(screen.getAllByTestId("page-heading")).toHaveLength(1);
    });

    it("should render a navigation title", () => {
      expect(screen.getByText("navigation.home")).toBeInTheDocument();
    });

    it("should render a <PageContent /> component", () => {
      expect(screen.getByTestId("page-heading")).toBeInTheDocument();
    });

    it("should render a dashboard overview component", () => {
      expect(screen.getByText(/dashboard.overview/i)).toBeInTheDocument();
    });

    it("should render a <SharedFromMyTeam /> component", () => {
      expect(screen.queryAllByText(/dashboard.dash_shared_from_my_team/i)).toHaveLength(3);
    });

    it("should render a <WorkflowIndividualCases /> component", () => {
      expect(screen.queryAllByText("dashboard.workflow - CP")).toHaveLength(1);
    });

    it("should render a <Approvals /> component", () => {
      expect(screen.getByText(/dashboard.approvals/i)).toBeInTheDocument();
    });

    it("should render a <OverdueTasks /> component", () => {
      expect(screen.getByText(/dashboard.cases_by_task_overdue/i, { selector: "h4" })).toBeInTheDocument();
    });

    it("should render a <WorkflowTeamCases /> component", () => {
      expect(screen.queryAllByText(/dashboard.workflow_team/i)).toHaveLength(3);
    });

    it("should render a <ReportingLocation /> component", () => {
      expect(screen.getByText(/dashboard.overview/i)).toBeInTheDocument();
    });

    it("should render a <ProtectionConcern /> component", () => {
      expect(screen.queryAllByText(/dashboard.protection_concerns/i)).toHaveLength(3);
    });
  });

  describe("when a user has SHARED_WITH_ME permission", () => {
    const stateSharedWithMe = fromJS({
      user: { permissions: { dashboards: [ACTIONS.DASH_SHARED_WITH_ME] } }
    });

    it("renders a <Referrals /> component and dashboard for a user with the RECEIVE_REFERRAL permission", () => {
      const stateWithReferrals = stateSharedWithMe.setIn(
        ["user", "permissions", "cases"],
        fromJS([ACTIONS.RECEIVE_REFERRAL])
      );

      mountedComponent(<Dashboard />, stateWithReferrals);

      expect(screen.queryByText(/dashboard.action_needed.referrals/i)).toBeInTheDocument();
      expect(screen.queryByText(/dashboard.dash_shared_with_me/i)).toBeInTheDocument();
    });

    it("does not render a <Referrals /> component for a user without the RECEIVE_REFERRAL permission", () => {
      mountedComponent(<Dashboard />, stateSharedWithMe);

      expect(screen.queryByText(/dashboard.action_needed.referrals/i)).toBeNull();
      expect(screen.queryByText(/dashboard.dash_shared_with_me/i)).toBeNull();
    });

    it("renders a <Transfer /> component and dashboard for a user with the RECEIVE_TRANSFER permission", () => {
      const stateWithTransfers = stateSharedWithMe.setIn(
        ["user", "permissions", "cases"],
        fromJS([ACTIONS.RECEIVE_TRANSFER])
      );

      mountedComponent(<Dashboard />, stateWithTransfers);

      expect(screen.queryByText(/dashboard.action_needed.transfers/i)).toBeInTheDocument();
      expect(screen.queryByText(/dashboard.dash_shared_with_me/i)).toBeInTheDocument();
    });

    it("does not render a <Transfer /> component for a user without the RECEIVE_TRANSFER permission", () => {
      mountedComponent(<Dashboard />, stateSharedWithMe);

      expect(screen.queryByText(/dashboard.action_needed.transfers/i)).toBeNull();
      expect(screen.queryByText(/dashboard.dash_shared_with_me/i)).toBeNull();
    });
  });

  describe("when a user has DASH_SHARED_WITH_OTHERS permission", () => {
    const stateSharedWithOther = fromJS({
      user: { permissions: { dashboards: [ACTIONS.DASH_SHARED_WITH_OTHERS] } }
    });

    it("renders a <Referrals /> component", () => {
      mountedComponent(<Dashboard />, stateSharedWithOther);

      expect(screen.queryByText(/dashboard.action_needed.referrals/i)).toBeInTheDocument();
      expect(screen.queryAllByText(/dashboard.dash_shared_with_others/i)).toHaveLength(2);
    });

    it("renders a <Transfer /> component and dashboard", () => {
      mountedComponent(<Dashboard />, stateSharedWithOther);

      expect(screen.queryByText(/dashboard.action_needed.transfers/i)).toBeInTheDocument();
      expect(screen.queryAllByText(/dashboard.dash_shared_with_others/i)).toHaveLength(2);
    });
  });

  describe("when a user has DASH_SHARED_WITH_MY_TEAM_OVERVIEW permission", () => {
    const stateSharedWithMyTeamOverview = fromJS({
      user: { permissions: { dashboards: [ACTIONS.DASH_SHARED_WITH_MY_TEAM_OVERVIEW] } }
    });

    it("renders a <Transfer /> component with the dashboard", () => {
      mountedComponent(<Dashboard />, stateSharedWithMyTeamOverview);

      expect(screen.queryByText(/dashboard.action_needed.transfers/i)).toBeInTheDocument();
      expect(screen.queryByText(/dashboard.dash_shared_with_my_team_overview/i)).toBeInTheDocument();
    });

    it("renders a <Transfer /> component with an the dashboard for the SHARED_WITH_ME permission", () => {
      const stateWithSharedWithMe = stateSharedWithMyTeamOverview
        .setIn(["user", "permissions", "cases"], fromJS([ACTIONS.RECEIVE_TRANSFER]))
        .setIn(
          ["user", "permissions", "dashboards"],
          fromJS([ACTIONS.DASH_SHARED_WITH_ME, ACTIONS.DASH_SHARED_WITH_MY_TEAM_OVERVIEW])
        );

      mountedComponent(<Dashboard />, stateWithSharedWithMe);

      expect(screen.queryByText(/dashboard.action_needed.transfers/i)).toBeInTheDocument();
      expect(screen.queryByText(/dashboard.dash_shared_with_me/i)).toBeInTheDocument();
      expect(screen.queryByText(/dashboard.dash_shared_with_my_team_overview/i)).toBeInTheDocument();
    });

    it("does not renders a <Referral /> component", () => {
      mountedComponent(<Dashboard />, stateSharedWithMyTeamOverview);

      expect(screen.queryByText(/dashboard.action_needed.referrals/i)).toBeNull();
    });
  });

  describe("when a user has DASH_CASE_RISK permission", () => {
    const stateCaseRisk = fromJS({
      user: { permissions: { dashboards: [ACTIONS.DASH_CASE_RISK] } }
    });

    it("renders the group overview dashboard", () => {
      mountedComponent(<Dashboard />, stateCaseRisk);

      expect(screen.getByText(/dashboard.case_risk/i)).toBeInTheDocument();
    });
  });

  describe("when a user has DASH_GROUP_OVERVIEW permission", () => {
    const stateGroupOverview = fromJS({
      user: { permissions: { dashboards: [ACTIONS.DASH_GROUP_OVERVIEW] } }
    });

    it("renders the group overview dashboard", () => {
      mountedComponent(<Dashboard />, stateGroupOverview);

      expect(screen.getByText(/dashboard.dash_group_overview/i)).toBeInTheDocument();
    });
  });

  describe("when a user has DASH_CASE_INCIDENT_OVERVIEW permission", () => {
    const stateCaseIncidentOverview = fromJS({
      user: { permissions: { dashboards: [ACTIONS.DASH_CASE_INCIDENT_OVERVIEW] } }
    });

    it("renders the case incident overview dashboard", () => {
      mountedComponent(<Dashboard />, stateCaseIncidentOverview);

      expect(screen.getByText(/dashboard.dash_case_incident_overview/i)).toBeInTheDocument();
    });
  });

  describe("when a user has DASH_NATIONAL_ADMIN_SUMMARY permission", () => {
    const stateNationalAdminSummary = fromJS({
      user: { permissions: { dashboards: [ACTIONS.DASH_NATIONAL_ADMIN_SUMMARY] } }
    });

    it("renders the case incident overview dashboard", () => {
      mountedComponent(<Dashboard />, stateNationalAdminSummary);

      expect(screen.getByText(/dashboard.dash_national_admin_summary/i)).toBeInTheDocument();
    });
  });
});
