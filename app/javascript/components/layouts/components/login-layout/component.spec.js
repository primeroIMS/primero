import { fromJS } from "immutable";

import { mountedComponent, screen, fireEvent } from "../../../../test-utils";

import LoginLayout from "./component";

describe("layouts/components/<LoginLayout />", () => {
  const state = fromJS({
    user: { module: "primero" },
    application: {
      primero: {
        locales: ["en", "es", "ar"],
        logos: [{ id: "Agency-ID", images: { logo_full: "random/string", logo_icon: "random/string" } }],
        agencies: [{ id: "Agency-ID", images: { logo_full: "another/string", logo_icon: "another/string" } }]
      }
    }
  });

  it("renders default PrimeroModule logo", () => {
    mountedComponent(<LoginLayout />, state);
    expect(screen.getByAltText(/Primero/i)).toBeInTheDocument();
  });

  it("renders a module logo", () => {
    mountedComponent(<LoginLayout />, state);
    expect(screen.getAllByRole("img", { className: "logo" })).toHaveLength(1);
  });

  it("renders an agency logo", () => {
    mountedComponent(<LoginLayout />, state);
    expect(document.querySelector(".agencyLogoContainer")).toBeInTheDocument();
    expect(document.querySelector(".agencyLogo")).toBeInTheDocument();
  });

  it("renders an TranslationsToggle component", () => {
    mountedComponent(<LoginLayout />, state);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("menuitem", { name: /home.en/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /home.es/i })).toBeInTheDocument();
  });

  describe("when is not demo site", () => {
    it("should not render a DemoIndicator", () => {
      mountedComponent(<LoginLayout />, state);
      expect(screen.queryByText(/sandbox_ui/i)).toBeNull();
    });
  });

  describe("when is demo site", () => {
    const stateWithDemoIndicator = {
      user: { module: "primero" },
      application: {
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
    };

    it("should render a DemoIndicator", () => {
      mountedComponent(<LoginLayout />, stateWithDemoIndicator);
      expect(screen.queryByText(/sandbox_ui/i)).toBeInTheDocument();
    });
  });
});
