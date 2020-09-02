import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../test";
import PageContainer, { PageHeading, PageContent } from "../../page";

import {
  Overview,
  SharedFromMyTeam,
  SharedWithMyTeam,
  WorkflowIndividualCases,
  Approvals,
  OverdueTasks,
  WorkflowTeamCases,
  ReportingLocation,
  ProtectionConcern
} from "./components";
import Dashboard from "./container";

describe("<Dashboard />", () => {
  let component;

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

  beforeEach(() => {
    ({ component } = setupMountedComponent(Dashboard, {}, initialState));
  });

  it("should render a <PageContainer /> component", () => {
    expect(component.find(PageContainer)).to.have.lengthOf(1);
  });
  it("should render a <PageHeading /> component", () => {
    expect(component.find(PageHeading)).to.have.lengthOf(1);
  });
  it("should render a <PageContent /> component", () => {
    expect(component.find(PageContent)).to.have.lengthOf(1);
  });
  it("should render a <Overview /> component", () => {
    expect(component.find(Overview)).to.have.lengthOf(1);
  });
  it("should render a <SharedFromMyTeam /> component", () => {
    expect(component.find(SharedFromMyTeam)).to.have.lengthOf(1);
  });
  it("should render a <SharedWithMyTeam /> component", () => {
    expect(component.find(SharedWithMyTeam)).to.have.lengthOf(1);
  });
  it("should render a <WorkflowIndividualCases /> component", () => {
    expect(component.find(WorkflowIndividualCases)).to.have.lengthOf(1);
  });
  it("should render a <Approvals /> component", () => {
    expect(component.find(Approvals)).to.have.lengthOf(1);
  });
  it("should render a <OverdueTasks /> component", () => {
    expect(component.find(OverdueTasks)).to.have.lengthOf(1);
  });
  it("should render a <WorkflowTeamCases /> component", () => {
    expect(component.find(WorkflowTeamCases)).to.have.lengthOf(1);
  });
  it("should render a <ReportingLocation /> component", () => {
    expect(component.find(ReportingLocation)).to.have.lengthOf(1);
  });
  it("should render a <ProtectionConcern /> component", () => {
    expect(component.find(ProtectionConcern)).to.have.lengthOf(1);
  });
});
