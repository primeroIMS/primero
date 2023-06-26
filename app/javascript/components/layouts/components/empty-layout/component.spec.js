import { mountedComponent, screen } from "../../../../test-utils";

import EmptyLayout from "./component";

describe("layouts/components/<EmptyLayout />", () => {
  const state = {
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
  };

  it("renders DemoIndicator component", () => {
    mountedComponent(
      <EmptyLayout>
        <div data-testid="test" />
      </EmptyLayout>,
      state
    );
    expect(screen.getByTestId("test")).toBeInTheDocument();
  });

  it("renders SessionTimeoutDialog component", () => {
    mountedComponent(
      <EmptyLayout>
        <div data-testid="test123" />
      </EmptyLayout>,
      state
    );
    expect(screen.getByTestId("test123")).toBeInTheDocument();
  });
});
