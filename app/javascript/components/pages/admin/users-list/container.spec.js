import { fromJS } from "immutable";
import last from "lodash/last";
import { mountedComponent, screen } from "test-utils";

import { ACTIONS } from "../../../permissions";
import { FiltersForm } from "../../../form-filters/components";

import actions from "./actions";
import UsersList from "./container";

describe("<UsersList />", () => {
  let component;

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

  xit("renders record list table", () => {
    expect(screen.getByText("IndexTable")).toBeInTheDocument();
  });

  it("renders FiltersForm", () => {
    expect(screen.getByTestId("form-filter")).toBeInTheDocument();
  });

  xit("submits the filters with the correct data", async () => {
    await component.find(FiltersForm).find("form").props().onSubmit();
    const setFiltersAction = last(
      component
        .props()
        .store.getActions()
        .filter(action => action.type === actions.SET_USERS_FILTER)
    );

    expect(setFiltersAction.payload).to.have.property("data");
  });

  xit("renders ToggleFilter", () => {
    expect(screen.getByTestId("toggle-filter")).toBeInTheDocument();
  });

  xit("renders FormFilters", () => {
    expect(screen.getByTestId("select-filter")).toBeInTheDocument();
  });
});
