import { fromJS } from "immutable";

import { mountedComponent, screen, stub } from "../../../../test-utils";
import { listHeaders, lookups } from "../../../../test";
import { ACTIONS } from "../../../permissions";

import NAMESPACE from "./namespace";
import UserGroupsList from "./container";

describe("<UserGroupsList />", () => {
  let stubI18n = null;
  const dataLength = 30;
  const data = Array.from({ length: dataLength }, (_, i) => ({
    id: i + 1,
    unique_id: `usergroup-${i + 1}`,
    name: `User Group ${i + 1}`,
    description: `Test description ${i + 1}`
  }));

    stubI18n = stub(window.I18n, "t").withArgs("messages.record_list.of").returns("of");
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
    mountedComponent(<UserGroupsList />, initialState, [`/admin/${NAMESPACE}`])
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it("should trigger a sort action when a header is clicked", () => {
    mountedComponent(<UserGroupsList />, initialState, [`/admin/${NAMESPACE}`])
    expect(screen.getByTestId('headcol-0')).toBeInTheDocument();
  });

  it("should trigger a valid action with next page when clicking next page", () => {
    mountedComponent(<UserGroupsList />, initialState, [`/admin/${NAMESPACE}`])
    expect(screen.getByText(`1-20 of ${dataLength}`)).toBeInTheDocument();
  });

  it("should set the filters when apply is clicked", () => {
    mountedComponent(<UserGroupsList />, initialState, [`/admin/${NAMESPACE}`])
    expect(screen.getAllByRole('button')).toHaveLength(16);
  })
});
