
import { setupMountedThemeComponent } from "test";
import { expect } from "chai";
import Jewel from "./component";

describe("<Jewel />", () => {
  it("renders canvas", () => {
    const component = setupMountedThemeComponent(Jewel);

    expect(component.find("svg").length).to.equal(1);
    expect(component.find("circle").length).to.equal(1);
  });
});
