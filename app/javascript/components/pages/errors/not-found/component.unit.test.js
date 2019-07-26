import "test/test.setup";
import { setupMountedComponent } from "test";
import { Map } from "immutable";
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

  it("renders svg logo", () => {
    expect(component.find("svg")).to.have.length(1);
  });

  it("renders h1 tag", () => {
    expect(component.find("h1")).to.have.length(1);
  });

  it("renders h2 tag", () => {
    expect(component.find("h2")).to.have.length(1);
  });

  it("renders p tag", () => {
    expect(component.find("p")).to.have.length(1);
  });

  it("renders forgot a tag", () => {
    expect(component.find("a").first().prop("href")).to.have.equal("/v2/dashboard");
  });

  it("renders login button", () => {
    expect(component.find("button")).to.have.length(1);
  });
});
