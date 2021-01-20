import { ExpansionPanel, ExpansionPanelSummary } from "@material-ui/core";

import { setupMountedComponent } from "../../../../../../test";
import ActionButton from "../../../../../action-button";

import MatchedTracePanel from "./component";

describe("<MatchedTracePanel />", () => {
  let component;
  const props = { css: {}, matchedTrace: { id: "123457" } };

  beforeEach(() => {
    ({ component } = setupMountedComponent(MatchedTracePanel, props, {}));
  });

  it("should render 1 <ExpansionPanel /> component", () => {
    expect(component.find(ExpansionPanel)).to.have.lengthOf(1);
  });

  it("should render 1 <ExpansionPanelSummary /> component", () => {
    expect(component.find(ExpansionPanelSummary)).to.have.lengthOf(1);
  });

  it("should render 1 <ActionButton /> component", () => {
    expect(component.find(ActionButton)).to.have.lengthOf(1);
  });
});
