
import { setupMountedComponent } from "../../../../test";
import { expect } from "chai";
import NotFound from "./component";

describe("<NotFound />", () => {
  let component;

  before(() => {
    component = setupMountedComponent(
      NotFound,
      { },
      { }
    ).component;
  });

  it("renders h1 tag", () => {
    expect(component.find("h1")).to.have.length(1);
  });

  it("renders h6 tag", () => {
    expect(component.find("h6")).to.have.length(1);
  });

  it("renders p tag", () => {
    expect(component.find("p")).to.have.length(1);
  });

  it("renders forgot a tag", () => {
    expect(
      component
        .find("a")
        .first()
        .prop("href")
    ).to.have.equal("/dashboard");
  });
});
