/* eslint-disable */

import React from "react";
import { expect } from "chai";
import "config/test.setup";
import { Map } from "immutable";
import AppLayout from "./AppLayout";
import { Nav } from "components/nav";
import { setupMountedComponent } from "libs/unit-test-helpers";

describe("<AppLayout />", () => {
  let component;

  before(() => {
    const state = Map({ Nav: { drawerOpen: true } });
    component = setupMountedComponent(AppLayout, {}, state).component;
  });

  it("renders navigation", () => {
    expect(component.find(Nav)).to.have.length(1);
  });

  it("navigates to incidents list", () => {
    component
      .find('a[href="/incidents"]')
      .simulate("click", { button: 0 });
    expect(component.find("main").text()).to.eq("Incidents");
  });
});
