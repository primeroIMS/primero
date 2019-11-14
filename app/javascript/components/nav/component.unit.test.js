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
import { PERMISSION_CONSTANTS } from "../../libs/permissions";

import Nav from "./component";

describe("<Nav />", () => {
  let component;
  const ProvidedNav = () => (
    <ApplicationProvider>
      <Nav />
    </ApplicationProvider>
  );
  const permissions = {
    cases: [PERMISSION_CONSTANTS.MANAGE],
    incidents: [PERMISSION_CONSTANTS.READ],
    dashboards: [PERMISSION_CONSTANTS.MANAGE, PERMISSION_CONSTANTS.DASH_TASKS],
    potential_matches: [PERMISSION_CONSTANTS.MANAGE],
    tracing_requests: [PERMISSION_CONSTANTS.READ],
    reports: [PERMISSION_CONSTANTS.MANAGE]
  }
  const initialState = fromJS({
    ui: { Nav: { drawerOpen: true } },
    application: {
      modules: {},
      online: true,
      agencies: [
        {
          unique_id: "agency_1",
          logo: { small: "/some/random.png" }
        }
      ]
    },
    user: {
      modules: [],
      agency: "agency_1",
      permissions
    }
  })

  beforeEach(() => {
    ({ component } = setupMountedComponent(
      ProvidedNav,
      { username: "joshua" },
      initialState
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

  describe("when have restricted permission", () => {
    const initialState = fromJS({
      ui: { Nav: { drawerOpen: true } },
      application: {
        modules: {},
        online: true,
        agencies: [
          {
            unique_id: "agency_1",
            logo: { small: "/some/random.png" }
          }
        ]
      },
      user: {
        modules: [],
        agency: "agency_1",
        permissions: {
          cases: [PERMISSION_CONSTANTS.READ]
        }
      }
    });

    beforeEach(() => {
      ({ component } = setupMountedComponent(
        ProvidedNav,
        { username: "username" },
        initialState
      ));
    });

    it("renders cases link", () => {
      expect(
        component
          .find(NavLink)
          .findWhere(link => link.prop("to") === ROUTES.cases)
      ).to.have.lengthOf(1);
    });
    it("doesn't renders export link", () => {
      expect(
        component
          .find(NavLink)
          .findWhere(link => link.prop("to") === ROUTES.exports)
      ).to.have.lengthOf(0);
    });
  });
});
