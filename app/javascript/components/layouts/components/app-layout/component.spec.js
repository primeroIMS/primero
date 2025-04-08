import { fromJS } from "immutable";

import { mountedComponent, screen, userEvent } from "../../../../test-utils";

import AppLayout from "./component";

describe("<AppLayout />", () => {
  describe("if hasUserPermissions is true", () => {
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
        primero: {
          sandbox_ui: true
        },
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

    it("renders navigation", () => {
      mountedComponent(<AppLayout />, state);
      expect(screen.getAllByAltText("Primero")).toHaveLength(3);
      expect(screen.getAllByRole("img", { className: "logo" })).toHaveLength(2);
    });

    it("navigate to cases list", async () => {
      const user = userEvent.setup();
      const { history } = mountedComponent(<AppLayout />, state);

      expect(screen.getAllByText("navigation.cases", { selector: "span" })).toHaveLength(2);
      await user.click(screen.getAllByText("navigation.cases")[0]);
      expect(history.location.pathname).toBe("/cases");
    });

    it("renders DemoIndicator component", () => {
      mountedComponent(<AppLayout />, state);
      expect(screen.queryAllByText(/sandbox_ui/i)).toHaveLength(2);
    });
  });

  describe("if hasUserPermissions is false", () => {
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

    it("should render CircularProgress", () => {
      mountedComponent(<AppLayout />, state);
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("renders DemoIndicator component", () => {
      mountedComponent(<AppLayout />, state);
      expect(screen.queryAllByText(/sandbox_ui/i)).toHaveLength(0);
    });
  });

  describe("when the mobile is displayed", () => {
    beforeEach(() => {
      jest.spyOn(window, "matchMedia").mockReturnValue(window.defaultMediaQueryList({ matches: true }));
    });

    it("should not render the DemoIndicator", () => {
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
            sandbox_ui: false
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

      mountedComponent(<AppLayout />, initialState);

      expect(screen.queryAllByText(/sandbox_ui/i)).toHaveLength(0);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
  });
});
