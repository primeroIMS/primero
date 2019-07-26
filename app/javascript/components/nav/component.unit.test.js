import { expect } from "chai";
import "test/test.setup";
import { setupMountedComponent } from "test";
import { Map } from "immutable";

import { TranslationsToggle } from "components/translations-toggle";
import { AgencyLogo } from "components/agency-logo";
import { ModuleLogo } from "components/module-logo";
import { AccountMenu } from "components/account-menu";
import Nav from "./component";

describe("<Nav />", () => {
  let component;

  before(() => {
    component = setupMountedComponent(
      Nav,
      { username: "joshua" },
      Map({ ui: Map({ Nav: { drawerOpen: true } }) })
    ).component;
  });

  it("renders a module logo", () => {
    expect(component.find(ModuleLogo)).to.have.length(1);
  });

  it("renders account menu", () => {
    expect(component.find(AccountMenu)).to.have.length(1);
  });

  it("renders an agency logo", () => {
    expect(component.find(AgencyLogo)).to.have.length(1);
  });

  it("renders translation toggle", () => {
    expect(component.find(TranslationsToggle)).to.have.length(1);
  });

  describe("nav links", () => {
    // TODO: These will change based on permissions
    it("renders home link", () => {
      expect(component.find({ href: "/dashboard" })).to.have.length(1);
    });

    it("renders tasks link", () => {
      expect(component.find({ href: "/tasks" })).to.have.length(1);
    });

    it("renders cases link", () => {
      expect(component.find({ href: "/cases" })).to.have.length(1);
    });

    it("renders incidents link", () => {
      expect(component.find({ href: "/incidents" })).to.have.length(1);
    });

    it("renders tracing requests link", () => {
      expect(component.find({ href: "/tracing_requests" })).to.have.length(1);
    });

    it("renders matches link", () => {
      expect(component.find({ href: "/matches" })).to.have.length(1);
    });

    it("renders reports link", () => {
      expect(component.find({ href: "/reports" })).to.have.length(1);
    });

    it("renders exports link", () => {
      expect(component.find({ href: "/exports" })).to.have.length(1);
    });
  });
});
