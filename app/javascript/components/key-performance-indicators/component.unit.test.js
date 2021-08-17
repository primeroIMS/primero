import { fromJS } from "immutable";

import { setupMountedComponent } from "../../test";
import { ACTIONS } from "../../libs/permissions";

import KeyPerformanceIndicators from "./component";
import NumberOfCases from "./components/number-of-cases";
import NumberOfIncidents from "./components/number-of-incidents";
import ReportingDelay from "./components/reporting-delay";
import AssessmentStatus from "./components/assessment-status";
import CompletedCaseSafetyPlan from "./components/completed-case-action-plan";
import CompletedCaseActionPlan from "./components/completed-case-safety-plan";
import CompletedSupervisorApprovedCaseActionPlan from "./components/completed-supervisor-approved-case-action-plan";
import ServicesProvided from "./components/services-provided";
import AverageReferrals from "./components/average-referrals";
import AverageFollowupMeetingsPerCase from "./components/average-followup-meetings-per-case";
import TimeFromCaseOpenToClose from "./components/time-from-case-open-to-case-close";
import CaseClosureRate from "./components/case-closure-rate";
import ClientSatisfactionRate from "./components/client-satisfaction-rate";
import SupervisorToCaseworkerRatio from "./components/supervisor-to-caseworker-ratio";
import CaseLoad from "./components/case-load";

describe("<KeyPerformanceIndicators />", () => {
  const { component } = setupMountedComponent(
    KeyPerformanceIndicators,
    {},
    fromJS({
      user: {
        permissions: {
          kpis: [
            ACTIONS.KPI_ASSESSMENT_STATUS,
            ACTIONS.KPI_AVERAGE_FOLLOWUP_MEETINGS_PER_CASE,
            ACTIONS.KPI_AVERAGE_REFERRALS,
            ACTIONS.KPI_CASE_CLOSURE_RATE,
            ACTIONS.KPI_CASE_LOAD,
            ACTIONS.KPI_CLIENT_SATISFACTION_RATE,
            ACTIONS.KPI_COMPLETED_CASE_ACTION_PLANS,
            ACTIONS.KPI_COMPLETED_CASE_SAFETY_PLANS,
            ACTIONS.KPI_COMPLETED_SUPERVISOR_APPROVED_CASE_ACTION_PLANS,
            ACTIONS.KPI_GOAL_PROGRESS_PER_NEED,
            ACTIONS.KPI_NUMBER_OF_CASES,
            ACTIONS.KPI_NUMBER_OF_INCIDENTS,
            ACTIONS.KPI_REPORTING_DELAY,
            ACTIONS.KPI_SERVICES_PROVIDED,
            ACTIONS.KPI_SUPERVISOR_TO_CASEWORKER_RATIO,
            ACTIONS.KPI_TIME_FROM_CASE_OPEN_TO_CLOSE
          ]
        }
      }
    })
  );

  it("should render the NumberOfCases KPI", () => {
    expect(component.find(NumberOfCases).exists()).to.be.true;
  });

  it("should render the NumberOfIncidents KPI", () => {
    expect(component.find(NumberOfIncidents).exists()).to.be.true;
  });

  it("should render the ReportingDelay KPI", () => {
    expect(component.find(ReportingDelay).exists()).to.be.true;
  });

  it("should render the AssessmentStatus KPI", () => {
    expect(component.find(AssessmentStatus).exists()).to.be.true;
  });

  it("should render the CompletedCaseSafetyPlan KPI", () => {
    expect(component.find(CompletedCaseSafetyPlan).exists()).to.be.true;
  });

  it("should render the CompletedCaseActionPlan KPI", () => {
    expect(component.find(CompletedCaseActionPlan).exists()).to.be.true;
  });

  it("should render the CompletedSupervisorApprovedCaseActionPlan KPI", () => {
    expect(component.find(CompletedSupervisorApprovedCaseActionPlan).exists()).to.be.true;
  });

  it("should render the ServicesProvided KPI", () => {
    expect(component.find(ServicesProvided).exists()).to.be.true;
  });

  it("should render the AverageReferrals KPI", () => {
    expect(component.find(AverageReferrals).exists()).to.be.true;
  });

  it("should render the AverageFollowupMeetingsPerCase KPI", () => {
    expect(component.find(AverageFollowupMeetingsPerCase).exists()).to.be.true;
  });

  it("should render the TimeFromCaseOpenToClose KPI", () => {
    expect(component.find(TimeFromCaseOpenToClose).exists()).to.be.true;
  });

  it("should render the CaseClosureRate KPI", () => {
    expect(component.find(CaseClosureRate).exists()).to.be.true;
  });

  it("should render the ClientSatisfactionRate KPI", () => {
    expect(component.find(ClientSatisfactionRate).exists()).to.be.true;
  });

  it("should render the SupervisorToCaseworkerRatio KPI", () => {
    expect(component.find(SupervisorToCaseworkerRatio).exists()).to.be.true;
  });

  it("should render the CaseLoad KPI", () => {
    expect(component.find(CaseLoad).exists()).to.be.true;
  });
});
