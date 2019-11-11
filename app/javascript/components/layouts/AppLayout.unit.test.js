import { expect } from "chai";
import { fromJS } from "immutable";
import { CircularProgress } from "@material-ui/core";

import { setupMountedComponent } from "../../test";
import { routes } from "../../config";
import { Nav } from "../nav";

import AppLayout from "./AppLayout";

describe("<AppLayout />", () => {
  let component;

  describe("if hasUserPermissions is true", () => {
    beforeEach(() => {
      const state = fromJS({
        ui: {
          Nav: {
            drawerOpen: true
          }
        },
        user: {
          modules: "primero",
          agency: "unicef",
          isAuthenticated: true,
          messages: null,
          permissions: {
            incidents: ["manage"],
            tracing_requests: ["manage"],
            cases: ["manage"]
          }
        },
        application: {
          baseLanguage: "en",
          modules: [
            {
              unique_id: "primeromodule-cp",
              name: "CP",
              associated_record_types: ["case"]
            }
          ]
        }
      });

      component = setupMountedComponent(
        AppLayout,
        { route: routes[0] },
        state,
        ["/cases"]
      ).component;
    });

    it("renders navigation", () => {
      expect(component.find(Nav)).to.have.length(1);
    });

    // TODO: Need to figure out how to better test
    it("navigates to incidents list", () => {
      component.find('a[href="/incidents"]').simulate("click", { button: 0 });
      expect(
        component.find('a[href="/incidents"]').hasClass("active")
      ).to.equal(true);
    });
  });

  describe("if hasUserPermissions is false", () => {
    beforeEach(() => {
      const state = fromJS({
        ui: {
          Nav: {
            drawerOpen: true
          }
        },
        user: {
          module: "primero",
          agency: "unicef",
          isAuthenticated: true,
          messages: null
        },
        application: {
          baseLanguage: "en"
        }
      });

      component = setupMountedComponent(
        AppLayout,
        { route: routes[0] },
        state,
        ["/cases"]
      ).component;
    });

    it("renders CircularProgress", () => {
      expect(component.find(CircularProgress)).to.have.length(1);
    });
  });
});
