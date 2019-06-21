import { setupMountedComponent } from "test";
import { expect } from "chai";
import "test/test.setup";
import Login from "./container";

describe("<Login />", () => {
  let component;

  before(() => {
    component = setupMountedComponent(
      Login,
      { },
      { }
    ).component;
  });

  it("renders form", () => {
    expect(component.find("form")).to.have.length(1);
  });

  it("renders username and password input fields", () => {
    expect(component.find("input").first().prop("name")).to.have.equal("email");
    expect(component.find("input").last().prop("name")).to.have.equal("password");
  });

  it("renders forgot password link", () => {
    expect(component.find("a").first().prop("href")).to.have.equal("/forgot_password");
  });

  it("renders login button", () => {
    expect(component.find("button").first().prop("type")).to.equal("submit");
  });
});
