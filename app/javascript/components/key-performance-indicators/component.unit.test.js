import { setupMountedComponent } from "../../../test";

import KeyPerformanceIndicators from "./container";
import {
  NumberOfCases,
  NumberOfIncidents,
  ReportingDelay,
  AssessmentStatus,
  CompletedCaseSafetyPlan,
  CompletedCaseActionPlan,
  CompletedSupervisorApprovedCaseActionPlan,
  ServicesProvided,
  AverageReferrals,
  AverageFollowupMeetingsPerCase,
  GoalProgressPerNeed,
  TimeFromCaseOpenToClose,
  CaseClosureRate,
  ClientSatisfactionRate,
  SupervisorToCaseworkerRatio,
  CaseLoad
} from "./components";

describe("<KeyPerformanceIndicators />", () => {
  const { component } = setupMountedComponent(KeyPerformanceIndicators);

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
    expect(component.find(CompletedSupervisorApprovedCaseActionPlan).exists())
      .to.be.true;
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

  it("should render the GoalProgressPerNeed KPI", () => {
    expect(component.find(GoalProgressPerNeed).exists()).to.be.true;
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
