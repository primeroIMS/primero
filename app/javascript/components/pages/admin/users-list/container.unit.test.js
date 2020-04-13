import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";
import IndexTable from "../../../index-table";
import { ACTIONS } from "../../../../libs/permissions";

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

    ({ component } = setupMountedComponent(UsersList, {}, initialState, [
      "/admin/users"
    ]));
  });

  it("renders record list table", () => {
    expect(component.find(IndexTable)).to.have.length(1);
  });
});
