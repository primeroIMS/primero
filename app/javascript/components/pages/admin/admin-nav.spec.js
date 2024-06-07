// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { fireEvent, mountedComponent, screen, within } from "../../../test-utils";

import AdminNav from "./admin-nav";

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

    mountedComponent(<AdminNav routes={[]} />, state);

    it("should renders all AdminNavItem menus", () => {
      screen.debug();
      expect(screen.getAllByRole("button")).toHaveLength(10);
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

    mountedComponent(<AdminNav routes={[]} />, state);

    it("should render 'forms' menu (expanded) and default menus", () => {
      expect(screen.getAllByText("settings.navigation.forms").at(0)).toBeInTheDocument();
    });
  });
});
