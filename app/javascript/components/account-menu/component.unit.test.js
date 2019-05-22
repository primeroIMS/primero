import React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import "config/test.setup";
import { setupMountedComponent } from "libs/unit-test-helpers";

import AccountMenu from "./component";

describe("<AccountMenu />", () => {
  let component;

  before(() => {
    component = setupMountedComponent(AccountMenu, { username: "joshua" }, {})
      .component;
  });

  it("renders account link", () => {
    expect(component.find({ href: "/account" })).to.have.length(1);
  });

  it("renders signout link", () => {
    expect(component.find({ href: "/signout" })).to.have.length(1);
  });

  it("renders support link", () => {
    expect(component.find({ href: "/support" })).to.have.length(1);
  });
});
