import { createMocks } from "react-idle-timer";

import { mountedComponent, screen, act, waitFor } from "../../../../test-utils";

import EmptyLayout from "./component";

describe("layouts/components/<EmptyLayout />", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    createMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

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
      userIdle: true,
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
    },
    connectivity: {
      online: true,
      serverOnline: true
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
    expect(screen.getByText("sandbox_ui")).toBeInTheDocument();
  });

  it("renders SessionTimeoutDialog component", async () => {
    mountedComponent(
      <EmptyLayout>
        <div data-testid="test123" />
      </EmptyLayout>,
      state
    );
    expect(screen.getByText("sandbox_ui")).toBeInTheDocument();
    await act(() => jest.advanceTimersByTimeAsync(16 * 1000 * 60));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeInTheDocument();
    });
  });
});
