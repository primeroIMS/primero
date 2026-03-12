import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../test-utils";
import { ACTIONS } from "../../../permissions";
import { useApp } from "../../../application";

jest.mock("../../../application", () => ({
  ...jest.requireActual("../../../application"),
  useApp: jest.fn()
}));

import MenuEntry from "./component";

describe("<Nav />", () => {
  const permissions = {
    cases: [ACTIONS.MANAGE],
    incidents: [ACTIONS.READ],
    dashboards: [ACTIONS.MANAGE, ACTIONS.DASH_TASKS],
    potential_matches: [ACTIONS.MANAGE],
    tracing_requests: [ACTIONS.READ],
    reports: [ACTIONS.MANAGE]
  };
  const state = {
    ui: { Nav: { drawerOpen: true } },
    application: {
      modules: {},
      online: true,
      agencies: [
        {
          unique_id: "agency_1",
          logo: { small: "/some/random.png" }
        }
      ],
      disabledApplication: false
    },
    user: {
      modules: [],
      agency: "agency_1",
      permissions
    }
  };

  const props = {
    closeDrawer: () => {},
    jewelCount: 0,
    menuEntry: {
      to: "/test",
      name: "test",
      icon: "testIcon",
      disableOffline: false,
      disabled: false
    },
    mobileDisplay: false,
    username: "joshua"
  };

  beforeEach(() => {
    useApp.mockReturnValue({
      modules: fromJS([]),
      userModules: fromJS([]),
      online: true
    });
  });

  it("renders menu", () => {
    mountedComponent(<MenuEntry {...props} />, state);
    expect(screen.getByText(/test/i)).toBeInTheDocument();
  });

  it("renders a ListItemText", () => {
    mountedComponent(<MenuEntry {...props} />, state);
    expect(screen.getByTestId("listItemText")).toBeInTheDocument();
  });

  it("renders a ListItem", () => {
    mountedComponent(<MenuEntry {...props} />, state);
    expect(screen.getByTestId("listItem")).toBeInTheDocument();
  });

  describe("when application is disabled", () => {
    const stateWithDisabledApp = fromJS({ ...state, application: { ...state.application, disabledApplication: true } });

    it("renders a disabled ListItem", () => {
      mountedComponent(<MenuEntry {...props} />, stateWithDisabledApp);
      expect(screen.getByTestId("listItem")).toBeInTheDocument();
    });
  });

  it("renders a ListItem with module_id query param when user has multiple modules and route is filterable", () => {
    useApp.mockReturnValue({
      modules: fromJS([{ unique_id: "cases" }, { unique_id: "incidents" }]),
      userModules: fromJS([{ unique_id: "cases" }, { unique_id: "incidents" }]),
      online: true
    });

    const multiModuleProps = {
      ...props,
      menuEntry: {
        ...props.menuEntry,
        to: "/cases"
      }
    };

    mountedComponent(<MenuEntry {...multiModuleProps} />, state);
    const link = screen.getByRole("link");

    expect(link).toHaveAttribute("href", expect.stringMatching(/\/cases\?.*module_id.*=cases/));
    expect(link).toHaveAttribute("href", expect.stringMatching(/module_id.*=incidents/));
  });
});
