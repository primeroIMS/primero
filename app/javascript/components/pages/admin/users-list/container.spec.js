import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { ACTIONS } from "../../../permissions";

import UsersList from "./container";

describe("<UsersList />", () => {
  beforeEach(() => {
    const initialState = fromJS({
      records: {
        users: {
          data: [
            {
              id: "1",
              user_name: "Jose"
            },
            {
              id: "2",
              user_name: "Carlos"
            }
          ],
          metadata: { total: 2, per: 20, page: 1 }
        }
      },
      user: {
        permissions: {
          users: [ACTIONS.MANAGE]
        }
      }
    });

    mountedComponent(<UsersList />, initialState, ["/admin/users"]);
  });

  it("renders record list table", () => {
    expect(screen.getAllByText("users.label")).toBeTruthy();
  });

  it("renders FiltersForm", () => {
    expect(screen.getByTestId("form-filter")).toBeInTheDocument();
  });

  it("renders ToggleFilter", () => {
    expect(screen.getByTestId("toggle-filter")).toBeInTheDocument();
  });

  it("renders FormFilters", () => {
    expect(screen.getByTestId("select-filter")).toBeInTheDocument();
  });

  it("renders CustomToolbar as label", () => {
    expect(screen.getByTestId("select-filter")).toBeInTheDocument();
  });

  it("should NOT render warning to list user", () => {
    expect(screen.queryByText("users.alerts.total_users_created")).toBeNull();
  });

  describe("when record access is denied", () => {
    beforeEach(() => {
      const initialState = fromJS({
        records: {
          users: {
            data: [
              {
                id: "1",
                user_name: "Jose"
              },
              {
                id: "2",
                user_name: "Carlos"
              }
            ],
            metadata: { total: 2, per: 20, page: 1, total_enabled: 40 }
          }
        },
        application: {
          systemOptions: {
            maximum_users: 40
          }
        }
      });

      mountedComponent(<UsersList />, initialState, ["/admin/users"]);
    });
    it("renders warning to list user", () => {
      expect(screen.getByTestId("internal-alert")).toBeInTheDocument();
    });
  });

  describe("When maximumUsers User is null", () => {
    beforeEach(() => {
      const initialState = fromJS({
        records: {
          users: {
            data: [
              {
                id: "1",
                user_name: "Jose"
              },
              {
                id: "2",
                user_name: "Carlos"
              }
            ],
            metadata: { total: 2, per: 20, page: 1, total_enabled: 40 }
          }
        },
        application: {
          systemOptions: {
            maximum_users: null
          }
        }
      });

      mountedComponent(<UsersList />, initialState, ["/admin/users"]);
    });

    it("should NOT render warning to list user", () => {
      expect(screen.queryByText("users.alerts.total_users_created")).toBeNull();
    });
  });

  it("should render <SearchBox /> component", () => {
    expect(screen.queryByText("users.filters.search")).toBeInTheDocument();
  });
});
