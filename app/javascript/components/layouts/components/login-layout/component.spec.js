import { mountedComponent, screen } from "../../../../test-utils";

import LoginLayout from "./component";

describe("layouts/components/<LoginLayout />", () => {
  const state = {
    LoginLayout: { module: "primero" },
    application: { primero: { locales: ["en", "es", "ar"] } }
  };

  it("renders default PrimeroModule logo", () => {
    mountedComponent(<LoginLayout />, state);
    expect(screen.getByAltText(/Primero/i)).toBeInTheDocument();
  });
  it("renders a module logo", () => {
    mountedComponent(<LoginLayout />, state);
    expect(screen.queryAllByText((content, element) => element.tagName.toLowerCase() === "svg")).toHaveLength(2);
  });

  it("renders an agency logo", () => {
    mountedComponent(<LoginLayout />, state);
    expect(screen.queryAllByText((content, element) => element.tagName.toLowerCase() === "svg")).toHaveLength(2);
  });

  it("renders an TranslationsToggle component", () => {
    mountedComponent(<LoginLayout />, state);

    expect(screen.getByText(/home.en/i)).toBeInTheDocument();
  });

  describe("when is not demo site", () => {
    it("should not render a DemoIndicator", () => {
      mountedComponent(<LoginLayout />, state);
      expect(screen.queryByText(/sandbox_ui/i)).toBeNull();
    });
  });

  describe("when is demo site", () => {
    const stateWithDemoIndicator = {
      LoginLayout: { module: "primero" },
      records: {
        support: {
          data: {
            demo: true
          }
        }
      }
    };

    it("should render a DemoIndicator", () => {
      mountedComponent(<LoginLayout />, stateWithDemoIndicator);
      expect(screen.queryByText(/sandbox_ui/i)).toBeNull();
    });
  });
});
