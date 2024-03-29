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

  xit("renders FormFilters", () => {
    expect(screen.getByTestId("select-filter")).toBeInTheDocument();
  });
});
