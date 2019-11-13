import { expect } from "chai";
import { fromJS } from "immutable";
import React from "react";
import { NavLink } from "react-router-dom";

import { setupMountedComponent } from "../../test";
import { ROUTES } from "../../config";
import { TranslationsToggle } from "../translations-toggle";
import { AgencyLogo } from "../agency-logo";
import { ModuleLogo } from "../module-logo";
import { ApplicationProvider } from "../application/provider";

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
          agency: "agency_1",
          permissions: {
            cases: ["read"],
            incidents: ["read"],
            dashboards: ["manage", "dash_tasks"],
            potential_matches: ["manage"],
            tracing_requests: ["read"],
            reports: ["manage"]
          }
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

    it("it should not renders exports link", () => {
      expect(
        component
          .find(NavLink)
          .findWhere(link => link.prop("to") === ROUTES.exports)
      ).to.have.lengthOf(0);
    });
  });
});
