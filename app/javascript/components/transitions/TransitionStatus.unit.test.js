import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { Chip } from "@material-ui/core";
import TransitionStatus from "./TransitionStatus";

describe("<TransitionStatus />", () => {
  let component;
  const props = {
    status: "inprogress"
  };
  beforeEach(() => {
    ({ component } = setupMountedComponent(TransitionStatus, props));
  });

  it("renders a Chip TransitionStatus", () => {
    expect(component.find(TransitionStatus).find(Chip)).to.have.length(1);
  });
})