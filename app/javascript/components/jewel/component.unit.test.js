import { setupMountedThemeComponent } from "../../test";

import Jewel from "./component";

describe("<Jewel />", () => {
  it("renders canvas", () => {
    const component = setupMountedThemeComponent(Jewel);

    expect(component.find("svg").length).to.equal(1);
    expect(component.find("circle").length).to.equal(1);
  });

  it("renders error and alert canvas", () => {
    const component = setupMountedThemeComponent(Jewel, {
      value: "Menu 1",
      isForm: true,
      isError: true
    });

    expect(component.find("svg").length).to.equal(2);
    expect(component.find("circle").length).to.equal(2);
  });
});
