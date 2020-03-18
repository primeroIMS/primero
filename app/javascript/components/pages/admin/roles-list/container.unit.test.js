import { fromJS } from "immutable";

import { setupMountedComponent, expect } from "../../../../test";
import IndexTable from "../../../index-table";
import { ACTIONS } from "../../../../libs/permissions";

import RolesList from "./container";

describe("<RolesList />", () => {
  let component;

  beforeEach(() => {
    const initialState = fromJS({
      records: {
        roles: {
          loading: false,
          errors: false,
          data: [
            {
              id: "1",
              name: {
                en: "Role 1"
              }
            },
            {
              id: "2",
              name: {
                en: "Role 2"
              }
            }
          ],
          metadata: { total: 2, per: 20, page: 1 }
        }
      },
      user: {
        permissions: {
          roles: [ACTIONS.MANAGE]
        }
      }
    });

    ({ component } = setupMountedComponent(RolesList, {}, initialState, [
      "/admin/roles"
    ]));
  });

  it("renders record list table", () => {
    expect(component.find(IndexTable)).to.have.length(1);
  });
});
