import { Accordion, AccordionSummary } from "@material-ui/core";
import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../../../test";
import ActionButton from "../../../../../action-button";

import MatchedTracePanel from "./component";

describe("<MatchedTracePanel />", () => {
  let component;
  const props = { css: {}, matchedTrace: fromJS({ id: "123457" }) };

  beforeEach(() => {
    ({ component } = setupMountedComponent(MatchedTracePanel, props, {}));
  });

  it("should render 1 <Accordion /> component", () => {
    expect(component.find(Accordion)).to.have.lengthOf(1);
  });

  it("should render 1 <AccordionSummary /> component", () => {
    expect(component.find(AccordionSummary)).to.have.lengthOf(1);
  });

  it("should render 1 <ActionButton /> component", () => {
    expect(component.find(ActionButton)).to.have.lengthOf(1);
  });
});
