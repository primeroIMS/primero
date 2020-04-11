import { setupMountedComponent } from "../../test";

import DisplayData from "./component";

describe("<DisplayData />", () => {
  it("should render label and value props", () => {
    const { component } = setupMountedComponent(
      DisplayData,
      { label: "Test", value: "Test Value" },
      {}
    );
    const renderedTags = component.find("p");

    expect(renderedTags).to.have.lengthOf(2);
    expect(renderedTags.first().text()).to.be.equal("Test");
    expect(renderedTags.last().text()).to.be.equal("Test Value");
  });

  it("should render label prop and default value if any value is passed as a prop", () => {
    const { component } = setupMountedComponent(
      DisplayData,
      { label: "Test" },
      {}
    );
    const renderedTags = component.find("p");

    expect(renderedTags).to.have.lengthOf(2);
    expect(renderedTags.first().text()).to.be.equal("Test");
    expect(renderedTags.last().text()).to.be.equal("--");
  });
});
