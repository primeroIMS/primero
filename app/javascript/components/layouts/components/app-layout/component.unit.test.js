import { fromJS } from "immutable";
import { CircularProgress } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import { routes } from "../../../../config";
import { setupMountedComponent, stub } from "../../../../test";
import Nav from "../../../nav";
import DemoIndicator from "../../../demo-indicator";

import AppLayout from "./component";

describe("layouts/components/<AppLayout />", () => {
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
        },
        records: {
          support: {
            data: {
              demo: true
            }
          }
        }
      });

      component = setupMountedComponent(AppLayout, { route: routes[0] }, state, ["/cases"]).component;
    });

    it("renders navigation", () => {
      expect(component.find(Nav)).to.have.lengthOf(1);
    });

    // TODO: Need to figure out how to better test
    it("navigates to incidents list", () => {
      component.find('a[href="/incidents"]').at(1).simulate("click", { button: 0 });
      expect(component.find('a[href="/incidents"]').at(1).hasClass("active")).to.equal(true);
    });

    it("renders DemoIndicator component", () => {
      expect(component.find(DemoIndicator)).to.have.lengthOf(1);
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

      component = setupMountedComponent(AppLayout, { route: routes[0] }, state, ["/cases"]).component;
    });

    it("should render CircularProgress", () => {
      expect(component.find(CircularProgress)).to.have.lengthOf(1);
    });

    it("should not render DemoIndicator component", () => {
      expect(component.find(DemoIndicator)).to.be.empty;
    });
  });

  describe("when the mobile is displayed", () => {
    beforeEach(() => {
      stub(window, "matchMedia").returns(window.defaultMediaQueryList({ matches: true }));
    });

    it("should not render the DemoIndicator alert", () => {
      const initialState = fromJS({
        ui: {
          Nav: {
            drawerOpen: false
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
          ],
          primero: {
            sandbox_ui: true
          }
        },
        records: {
          support: {
            data: {
              demo: true
            }
          }
        }
      });

      const { component: appLayout } = setupMountedComponent(AppLayout, { route: routes[0] }, initialState, ["/cases"]);

      expect(appLayout.find(DemoIndicator).find(Alert)).to.have.lengthOf(0);
    });

    afterEach(() => {
      window.matchMedia.restore();
    });
  });
});
