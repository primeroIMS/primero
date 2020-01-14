import { expect } from "chai";
import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";

import LoginForm from "./container";

describe("<LoginForm />", () => {
  let component;

  before(() => {
    component = setupMountedComponent(
      LoginForm,
      { isAuthenticated: false },
      fromJS({
        idp: {
          use_identity_provider: false
        },
        user: {
          module: "primero",
          agency: "unicef",
          isAuthenticated: false
        }
      })
    ).component;
  });

  it("renders form", () => {
    expect(component.find("form")).to.have.length(1);
  });

  it("renders h1 tag", () => {
    expect(component.find("h1")).to.have.length(1);
  });

  it("renders username and password input fields", () => {
    expect(
      component
        .find("input")
        .first()
        .prop("name")
    ).to.have.equal("user_name");
    expect(
      component
        .find("input")
        .last()
        .prop("name")
    ).to.have.equal("password");
  });

  it("renders forgot password link", () => {
    expect(
      component
        .find("a")
        .first()
        .prop("href")
    ).to.have.equal("/forgot_password");
  });

  it("renders login button", () => {
    expect(
      component
        .find("button")
        .first()
        .prop("type")
    ).to.equal("submit");
  });
});
