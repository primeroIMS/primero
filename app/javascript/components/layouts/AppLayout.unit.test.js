import { expect } from "chai";
import "test/test.setup";
import { setupMountedComponent } from "test";
import { routes } from "config";
import { Map } from "immutable";
import { Nav } from "components/nav";
import { CircularProgress } from "@material-ui/core";
import AppLayout from "./AppLayout";

describe("<AppLayout />", () => {
  let component;

  describe("if appSettingsFetched is true", () => {
    beforeEach(() => {
      const state = Map({
        ui: Map({
          Nav: Map({
            drawerOpen: true
          })
        }),
        user: Map({
          module: "primero",
          agency: "unicef",
          isAuthenticated: true,
          messages: null,
          permissions: Map({
            incidents: ["manage"],
            tracing_requests: ["manage"],
            cases: ["manage"]
          })
        }),
        application: Map({
          baseLanguage: "en",
          appSettingsFetched: true
        })
      });
      component = setupMountedComponent(AppLayout, { route: routes[0] }, state)
        .component;
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

  describe("if appSettingsFetched is false", () => {
    beforeEach(() => {
      const state = Map({
        ui: Map({
          Nav: Map({
            drawerOpen: true
          })
        }),
        user: Map({
          module: "primero",
          agency: "unicef",
          isAuthenticated: true,
          messages: null
        }),
        application: Map({
          baseLanguage: "en",
          appSettingsFetched: false
        })
      });
      component = setupMountedComponent(AppLayout, { route: routes[0] }, state)
        .component;
    });

    it("renders CircularProgress", () => {
      expect(component.find(CircularProgress)).to.have.length(1);
    });
  });
});
