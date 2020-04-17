import { Icon } from "@material-ui/core";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";

import { setupMountedComponent } from "../../../../../../test";

import DragIndicator from "./component";

describe("<FormsList />/components/<DragIndicator />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(DragIndicator, { color: "error" }));
  });

  it("renders icon", () => {
    expect(component.find(DragIndicatorIcon)).to.have.lengthOf(1);
    expect(component.find(Icon)).to.have.lengthOf(1);
  });

  it("renders passes through props to icon", () => {
    expect(component.find(Icon).prop("color")).to.equal("error");
  });
});
