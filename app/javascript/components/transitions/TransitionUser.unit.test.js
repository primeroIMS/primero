
import { expect } from "chai";
import { setupMountedComponent } from "../../test";
import { Box } from "@material-ui/core";
import TransitionUser from "./TransitionUser";

describe("<TransitionUser />", () => {
  let component;
  const props = {
    label: "Recipient",
    transitionUser: "primero_cp",
    classes: {
      spaceGrid: "testStyle",
      transtionLabel: "testStyle",
      transtionValue: "testStyle"
    }
  };
  beforeEach(() => {
    ({ component } = setupMountedComponent(TransitionUser, props));
  });

  it("renders a Box component inside of TransitionUser", () => {
    expect(component.find(TransitionUser).find(Box)).to.have.length(1);
  });
})
