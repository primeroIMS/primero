import { describe, expect, it } from "@jest/globals";

import { mountedComponent, screen } from "../../../../test-utils";

import AppLayout from "./component";

describe("<AppLayout />", () => {
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

  it("renders navigation", () => {
    mountedComponent(<AppLayout />, state);
    expect(screen.getAllByAltText("Primero")).toHaveLength(3);
  });

  it("navigate to cases list", () => {
    mountedComponent(<AppLayout />, state);
    // screen.debug();
    expect(screen.getAllByText("navigation.cases")).toHaveLength(2);
  });

  it("navigate to cases lis", () => {
    mountedComponent(<AppLayout />, state);
    // screen.debug();
    expect(screen.getAllByText("navigation.incidents")).toHaveLength(2);
  });
});
