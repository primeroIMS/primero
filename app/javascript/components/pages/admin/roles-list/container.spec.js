import { fromJS } from "immutable";

import { mountedComponent, screen, lookups } from "../../../../test-utils";
import { ACTIONS } from "../../../permissions";

import RolesList from "./container";

describe("<RolesList />", () => {
  const dataLength = 30;
  const data = Array.from({ length: dataLength }, (_, i) => ({
    id: i + 1,
    unique_id: `roles-${i + 1}`,
    name: `Role ${i + 1}`,
    description: `Test description ${i + 1}`
  }));

  const initialState = fromJS({
    records: {
      admin: {
        roles: {
          data,
          metadata: { total: dataLength, per: 20, page: 1 },
          loading: false,
          errors: false
        }
      }
    },
    user: {
      permissions: {
        roles: [ACTIONS.MANAGE]
      }
    },
    forms: {
      options: {
        lookups: lookups()
      }
    }
  });

  jest.spyOn(window.I18n, "t").mockImplementation(arg => {
    if (arg === "messages.record_list.of") return "of";
    if (arg === "buttons.new") return "New";

    return arg;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("renders record list table", () => {
    mountedComponent(<RolesList />, initialState, ["/admin/roles"]);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("should trigger a valid action with next page when clicking next page", () => {
    mountedComponent(<RolesList />, initialState, ["/admin/roles"]);
    expect(screen.getByText(`1-20 of ${dataLength}`)).toBeInTheDocument();
  });

  it("should render new button", () => {
    mountedComponent(<RolesList />, initialState, ["/admin/roles"]);
    expect(screen.getByText(`New`)).toBeInTheDocument();
  });

  describe("when user can't create role", () => {
    const initialStateCreateRole = fromJS({
      records: {
        admin: {
          roles: {
            data,
            metadata: { total: dataLength, per: 20, page: 1 },
            loading: false,
            errors: false
          }
        }
      },
      user: {
        permissions: {
          roles: [ACTIONS.READ]
        }
      },
      forms: {
        options: {
          lookups: lookups()
        }
      }
    });

    it("should not render new button", () => {
      mountedComponent(<RolesList />, initialStateCreateRole, ["/admin/roles"]);
      expect(screen.queryByText(/New/)).not.toBeInTheDocument();
    });
  });
});
