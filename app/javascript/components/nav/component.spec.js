import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../test-utils";
import { ACTIONS } from "../permissions";

import Nav from "./component";

describe("<Nav />", () => {
  // eslint-disable-next-line react/display-name
  function ProvidedNav() {
    return <Nav />;
  }

  const permissions = {
    cases: [ACTIONS.MANAGE],
    incidents: [ACTIONS.READ],
    dashboards: [ACTIONS.MANAGE, ACTIONS.DASH_TASKS],
    potential_matches: [ACTIONS.MANAGE],
    tracing_requests: [ACTIONS.READ],
    reports: [ACTIONS.MANAGE],
    metadata: [ACTIONS.MANAGE],
    users: [ACTIONS.MANAGE]
  };
  const initialState = fromJS({
    ui: { Nav: { drawerOpen: true, alerts: { data: { case: 1 } } } },
    application: {
      modules: {},
      online: true,
      agencies: [
        {
          unique_id: "agency_1",
          logo: { small: "/some/random.png" }
        }
      ]
    },
    user: {
      modules: [],
      agency: "agency_1",
      roleGroupPermission: "self",
      permissions
    }
  });

  it("renders a module logo", () => {
    mountedComponent(<ProvidedNav username="joshua" />, initialState);
    expect(screen.getAllByRole("img", { className: "logo" })).toHaveLength(2);
  });

  it("renders an agency logo", () => {
    mountedComponent(<ProvidedNav username="joshua" />, initialState);
    expect(screen.getAllByRole("img", { className: "agencyLogoContainer" })).toHaveLength(2);
  });

  it("renders translation toggle", () => {
    mountedComponent(<ProvidedNav username="joshua" />, initialState);
    expect(screen.queryAllByText(/home.en/)).toHaveLength(2);
  });

  it("renders NetworkIndicator", () => {
    mountedComponent(<ProvidedNav username="joshua" />, initialState);
    expect(screen.getAllByText("online", { selector: "span" })).toHaveLength(3);
  });

  describe("nav links", () => {
    it("rendes listItems", () => {
      mountedComponent(<ProvidedNav username="joshua" />, initialState);
      expect(screen.getAllByRole("listitem")).toHaveLength(11);
    });

    // TODO: These will change based on permissions
    it("renders home link", () => {
      mountedComponent(<ProvidedNav username="joshua" />, initialState);
      expect(screen.queryAllByText(/navigation.home/i)).toHaveLength(2);
    });

    it("renders tasks link", () => {
      mountedComponent(<ProvidedNav username="joshua" />, initialState);
      expect(screen.queryAllByText(/navigation.tasks/i)).toHaveLength(2);
    });

    it("renders cases link", () => {
      mountedComponent(<ProvidedNav username="joshua" />, initialState);
      expect(screen.queryAllByText(/navigation.cases/i)).toHaveLength(2);
    });

    it("renders incidents link", () => {
      mountedComponent(<ProvidedNav username="joshua" />, initialState);
      expect(screen.queryAllByText(/navigation.incidents/i)).toHaveLength(2);
    });

    it("renders tracing requests link", () => {
      mountedComponent(<ProvidedNav username="joshua" />, initialState);
      expect(screen.queryAllByText(/navigation.tracing_request/i)).toHaveLength(2);
    });

    it("renders reports link", () => {
      mountedComponent(<ProvidedNav username="joshua" />, initialState);
      expect(screen.queryAllByText(/navigation.reports/i)).toHaveLength(2);
    });

    it("renders exports link", () => {
      mountedComponent(<ProvidedNav username="joshua" />, initialState);
      expect(screen.queryAllByText(/navigation.bulk_exports/i)).toHaveLength(2);
    });

    it("renders seetings link with alert", () => {
      mountedComponent(<ProvidedNav username="joshua" />, initialState);
      expect(screen.getAllByText("1", { selector: "span" })).toHaveLength(2);
    });
  });

  describe("when have restricted permission", () => {
    const restrictedPermissionInitialState = fromJS({
      ui: { Nav: { drawerOpen: true } },
      application: {
        modules: {},
        online: true,
        agencies: [
          {
            unique_id: "agency_1",
            logo: { small: "/some/random.png" }
          }
        ]
      },
      user: {
        modules: [],
        agency: "agency_1",
        roleGroupPermission: "self",
        permissions: {
          cases: [ACTIONS.READ]
        }
      }
    });

    it("renders cases link", () => {
      mountedComponent(<ProvidedNav username="username" />, restrictedPermissionInitialState);
      expect(screen.queryAllByText(/navigation.cases/i)).toHaveLength(2);
    });
    it("doesn't renders export link", () => {
      mountedComponent(<ProvidedNav username="username" />, restrictedPermissionInitialState);
      expect(screen.queryAllByText(/navigation.bulk_exports/i)).toHaveLength(0);
    });
  });

  describe("when component is rendered ", () => {
    const initialStateActions = fromJS({
      ui: {
        Nav: {
          drawerOpen: true,
          alerts: {
            data: {
              case: 2,
              incident: 0,
              tracing_request: 1
            }
          }
        }
      },
      application: {
        modules: {},
        online: true,
        agencies: [
          {
            unique_id: "agency_1",
            logo: { small: "/some/random.png" }
          }
        ]
      },
      user: {
        modules: [],
        agency: "agency_1",
        roleGroupPermission: "self",
        permissions
      }
    });

    it("should fetch alerts", () => {
      mountedComponent(<ProvidedNav username="joshua" />, initialStateActions);
      expect(screen.getAllByText("1", { selector: "span" })).toHaveLength(2);
      expect(screen.getAllByText("2", { selector: "span" })).toHaveLength(2);
    });
  });

  describe("when offline", () => {
    const userId = 1;
    const offlineInitialState = fromJS({
      ui: { Nav: { drawerOpen: true } },
      connectivity: {
        online: false,
        serverOnline: false
      },
      application: {
        modules: {},
        agencies: [
          {
            unique_id: "agency_1",
            logo: { small: "/some/random.png" }
          }
        ]
      },
      user: {
        id: userId,
        modules: [],
        agency: "agency_1",
        roleGroupPermission: "self",
        permissions: {
          cases: [ACTIONS.READ]
        }
      }
    });

    it("renders a disabled my account link", () => {
      mountedComponent(<ProvidedNav username="username" />, offlineInitialState);
      expect(screen.queryAllByRole("link")[2]).toHaveAttribute("disabled", "");
    });
  });

  describe("when roleGroupPermission is IDENTIFIED", () => {
    const identifiedInitialState = fromJS({
      ui: { Nav: { drawerOpen: true } },
      application: {
        modules: {},
        online: true,
        agencies: [
          {
            unique_id: "agency_1",
            logo: { small: "/some/random.png" }
          }
        ]
      },
      user: {
        modules: [],
        agency: "agency_1",
        roleGroupPermission: "identified",
        permissions: {
          cases: [ACTIONS.READ]
        }
      }
    });

    it("does not render the cases link", () => {
      mountedComponent(<ProvidedNav username="username" />, identifiedInitialState);
      expect(screen.queryAllByText(/navigation.cases/i)).toHaveLength(0);
    });

    it("renders the My Case link", () => {
      mountedComponent(<ProvidedNav username="username" />, identifiedInitialState);
      expect(screen.queryAllByText(/navigation.my_case/i)).toHaveLength(2);
    });
  });
});
