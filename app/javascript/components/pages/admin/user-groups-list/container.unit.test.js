import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";
import IndexTable from "../../../index-table";
import { ACTIONS } from "../../../../libs/permissions";

import UserGroupsList from "./container";

describe("<UserGroupsList />", () => {
  let component;

  beforeEach(() => {
    const initialState = fromJS({
      records: {
        user_groups: {
          data: [
            {
              id: 1,
              unique_id: "usergroup-first-group"
            },
            {
              id: 2,
              unique_id: "usergroup-second-group"
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

    ({ component } = setupMountedComponent(UserGroupsList, {}, initialState, [
      "/admin/user_groups"
    ]));
  });

  it("renders record list table", () => {
    expect(component.find(IndexTable)).to.have.length(1);
  });
});
