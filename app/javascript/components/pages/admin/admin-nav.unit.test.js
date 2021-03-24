import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../test";

import AdminNav from "./admin-nav";
import AdminNavItem from "./admin-nav-item";

describe("<AdminNav />", () => {
  describe("when the user has access to all admin-nav entries", () => {
    const state = fromJS({
      user: {
        permissions: {
          agencies: ["manage"],
          audit_logs: ["manage"],
          cases: ["manage"],
          dashboards: ["dash_reporting_location", "dash_protection_concerns"],
          duplicates: ["read"],
          incidents: ["manage"],
          matching_configurations: ["manage"],
          metadata: ["manage"],
          potential_matches: ["read"],
          reports: ["manage"],
          roles: ["manage"],
          systems: ["manage"],
          tracing_requests: ["manage"],
          user_groups: ["manage"],
          users: ["manage"],
          primero_configurations: ["manage"],
          codes_of_conduct: ["manage"]
        }
      }
    });

    const { component } = setupMountedComponent(
      AdminNav,
      {
        routes: []
      },
      state
    );

    it("should render AdminNav component", () => {
      expect(component.find(AdminNav)).to.have.lengthOf(1);
    });

    it("should renders all AdminNavItem menus", () => {
      expect(component.find(AdminNavItem)).to.have.lengthOf(10);
    });
  });

  describe("when the user has access to forms admin-nav", () => {
    const state = fromJS({
      user: {
        permissions: {
          metadata: ["manage"]
        }
      }
    });

    const { component } = setupMountedComponent(
      AdminNav,
      {
        routes: []
      },
      state
    );

    it("should render AdminNav component", () => {
      expect(component.find(AdminNav)).to.have.lengthOf(1);
    });

    it("should render 'forms' menu (expanded) and default menus", () => {
      const menus = component.find(AdminNavItem);
      const formsMenu = menus.at(0);

      expect(menus).to.have.lengthOf(4);
      expect(formsMenu.props().open).to.be.true;
    });
  });
});
