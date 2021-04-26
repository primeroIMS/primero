import { Map, fromJS } from "immutable";
import { Accordion, AccordionDetails, AccordionSummary } from "@material-ui/core";

import { setupMountedComponent } from "../../../../test";
import ApprovalSummary from "../summary";
import ApprovalDetail from "../detail";

import ApprovalPanel from "./component";

describe("<ApprovalPanel /> - Component", () => {
  let component;
  const props = {
    approvalSubform: fromJS({
      approval_date: "2020-01-01"
    }),
    css: {}
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(ApprovalPanel, props, Map({})));
  });

  it("render ApprovalPanel component", () => {
    expect(component.find(ApprovalPanel)).to.have.length(1);
  });

  it("render a Accordion", () => {
    expect(component.find(Accordion)).to.have.lengthOf(1);
    expect(component.find(AccordionSummary)).to.have.lengthOf(1);
    expect(component.find(AccordionDetails)).to.have.lengthOf(1);
  });

  it("render a ApprovalSummary", () => {
    expect(component.find(ApprovalSummary)).to.have.lengthOf(1);
  });

  it("render a ApprovalSummary", () => {
    expect(component.find(ApprovalDetail)).to.have.lengthOf(1);
  });

  it("renders component with valid props", () => {
    const approvalsProps = { ...component.find(ApprovalPanel).props() };

    ["approvalSubform", "css"].forEach(property => {
      expect(approvalsProps).to.have.property(property);
      delete approvalsProps[property];
    });
    expect(approvalsProps).to.be.empty;
  });
});
