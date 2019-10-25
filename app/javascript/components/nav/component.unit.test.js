import { expect } from "chai";
import "test/test.setup";
import { setupMountedComponent } from "test";
import { fromJS } from "immutable";
import React from "react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "config";
import { TranslationsToggle } from "components/translations-toggle";
import { AgencyLogo } from "components/agency-logo";
import { ModuleLogo } from "components/module-logo";
import { ApplicationProvider } from "components/application/provider";
import Nav from "./component";

describe("<Nav />", () => {
  let component;
  const ProvidedNav = () => (
    <ApplicationProvider>
      <Nav />
    </ApplicationProvider>
  );

  beforeEach(() => {
    ({ component } = setupMountedComponent(
      ProvidedNav,
      { username: "joshua" },
      fromJS({
        ui: { Nav: { drawerOpen: true } },
        application: {
          modules: {},
          online: true,
          agencies: [
            {
              unique_id: "agency_1",
              logo: { small: "/rails/active_storage/blobs/eyJfcm/logo.png" }
            }
          ]
        },
        user: {
          modules: [],
          agency: "agency_1"
        }
      })
    ));
  });

  it("renders a module logo", () => {
    expect(component.find(ModuleLogo)).to.have.lengthOf(1);
  });

  it("renders an agency logo", () => {
    expect(component.find(AgencyLogo)).to.have.lengthOf(1);
  });

  it("renders translation toggle", () => {
    expect(component.find(TranslationsToggle)).to.have.lengthOf(1);
  });

  describe("nav links", () => {
    // TODO: These will change based on permissions
    it("renders home link", () => {
      expect(
        component
          .find(NavLink)
          .findWhere(link => link.prop("to") === ROUTES.dashboard)
      ).to.have.lengthOf(1);
    });

    it("renders tasks link", () => {
      expect(
        component
          .find(NavLink)
          .findWhere(link => link.prop("to") === ROUTES.tasks)
      ).to.have.lengthOf(1);
    });

    it("renders cases link", () => {
      expect(
        component
          .find(NavLink)
          .findWhere(link => link.prop("to") === ROUTES.cases)
      ).to.have.lengthOf(1);
    });

    it("renders incidents link", () => {
      expect(
        component
          .find(NavLink)
          .findWhere(link => link.prop("to") === ROUTES.incidents)
      ).to.have.lengthOf(1);
    });

    it("renders tracing requests link", () => {
      expect(
        component
          .find(NavLink)
          .findWhere(link => link.prop("to") === ROUTES.tracing_requests)
      ).to.have.lengthOf(1);
    });

    it("renders matches link", () => {
      expect(
        component
          .find(NavLink)
          .findWhere(link => link.prop("to") === ROUTES.matches)
      ).to.have.lengthOf(1);
    });

    it("renders reports link", () => {
      expect(
        component
          .find(NavLink)
          .findWhere(link => link.prop("to") === ROUTES.reports)
      ).to.have.lengthOf(1);
    });

    it("renders exports link", () => {
      expect(
        component
          .find(NavLink)
          .findWhere(link => link.prop("to") === ROUTES.exports)
      ).to.have.lengthOf(1);
    });
  });
});
