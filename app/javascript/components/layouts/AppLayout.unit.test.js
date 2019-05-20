/* eslint-disable */

import React from "react";
import { expect } from "chai";
import "config/test.setup";

import AppLayout from "./AppLayout";
import { Nav } from "components/nav";
import { setupMountedComponent } from "libs/unit-test-helpers";

describe("<AppLayout />", () => {
  let component;

  before(() => {
    component = setupMountedComponent(AppLayout).component;
  });

  it("renders navigation", () => {
    expect(component.find(Nav)).to.have.length(1);
  });

  it("navigates to incidents list", () => {
    component
      .find({ to: "/incidents" })
      .at(0)
      .simulate("click", { button: 0 });
    expect(component.find("Incidents")).to.have.length(1);
  });
});
