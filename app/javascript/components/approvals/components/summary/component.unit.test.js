import { Map, fromJS } from "immutable";
import { Grid } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";

import { setupMountedComponent, expect } from "../../../../test";

import ApprovalSummary from "./component";

describe("<ApprovalSummary /> - Component", () => {
  let component;
  const props = {
    approvalSubform: fromJS({
      approval_date: "2020-01-01"
    }),
    css: {},
    isRequest: false,
    isResponse: true
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(ApprovalSummary, props, Map({})));
  });

  it("render ApprovalSummary component", () => {
    expect(component.find(ApprovalSummary)).to.have.length(1);
  });

  it("render a Grid", () => {
    expect(component.find(Grid)).to.have.lengthOf(3);
  });

  it("render a Chip", () => {
    expect(component.find(Chip)).to.have.lengthOf(1);
  });

  it("renders component with valid props", () => {
    const approvalsProps = { ...component.find(ApprovalSummary).props() };

    ["approvalSubform", "css", "isRequest", "isResponse"].forEach(property => {
      expect(approvalsProps).to.have.property(property);
      delete approvalsProps[property];
    });
    expect(approvalsProps).to.be.empty;
  });
});
