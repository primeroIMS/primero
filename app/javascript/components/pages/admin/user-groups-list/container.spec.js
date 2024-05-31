import { fromJS } from "immutable";

import { mountedComponent, screen, userEvent } from "../../../../test-utils";
import { listHeaders, lookups } from "../../../../test";
import { ACTIONS } from "../../../permissions";

import NAMESPACE from "./namespace";
import UserGroupsList from "./container";

describe("<UserGroupsList />", () => {
  const dataLength = 30;
  const data = Array.from({ length: dataLength }, (_, i) => ({
    id: i + 1,
    unique_id: `usergroup-${i + 1}`,
    name: `User Group ${i + 1}`,
    description: `Test description ${i + 1}`
  }));

  const initialState = fromJS({
    records: {
      user_groups: {
        data,
        metadata: { total: dataLength, per: 20, page: 1 },
        loading: false,
        errors: false
      }
    },
    user: {
      permissions: {
        users: [ACTIONS.MANAGE]
      },
      listHeaders: {
        user_groups: listHeaders(NAMESPACE)
      }
    },
    forms: {
      options: {
        lookups: lookups()
      }
    }
  });

  it("should render record list table", () => {
    mountedComponent(<UserGroupsList />, initialState, {}, [`/admin/${NAMESPACE}`]);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("triggers a sort action when a header is clicked", async () => {
    const { store } = mountedComponent(<UserGroupsList />, initialState, {}, [`/admin/${NAMESPACE}`]);
    const user = userEvent.setup();
    const expectedAction = {
      payload: {
        data: fromJS({
          disabled: ["false"],
          total: 30,
          per: 20,
          page: 1,
          order: "asc",
          order_by: "name"
        })
      },
      type: "user_groups/SET_USER_GROUPS_FILTER"
    };

    const columnHeader = screen.getByTestId("headcol-0");

    await user.click(columnHeader);

    expect(expectedAction).toEqual(store.getActions()[2]);
  });

  it.skip("goes to a new page when clicking next page", async () => {
    // TODO: This test does not work because the rest middleware is required
    const user = userEvent.setup();

    mountedComponent(<UserGroupsList />, initialState, {}, [`/admin/${NAMESPACE}`]);

    await user.click(screen.getByTestId("pagination-next"));

    expect(screen.getByText("21-30 messages.record_list.of 30")).toBeInTheDocument();
  });

  it("should set the filters when apply is clicked", async () => {
    const user = userEvent.setup();
    const { store } = mountedComponent(<UserGroupsList />, initialState, {}, [`/admin/${NAMESPACE}`]);

    const expectedAction = {
      payload: { data: fromJS({ disabled: ["false"], total: 30, per: 20, page: 1 }) },
      type: "user_groups/SET_USER_GROUPS_FILTER"
    };

    await user.click(screen.getByText("filters.apply_filters"));

    const action = store.getActions()[1];

    expect(action).toEqual(expectedAction);
  });
});
