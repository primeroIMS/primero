import { fromJS } from "immutable";

import { setupMountedComponent, listHeaders, lookups } from "../../../../test";
import IndexTable from "../../../index-table";
import { ACTIONS } from "../../../../libs/permissions";

import NAMESPACE from "./namespace";
import UserGroupsList from "./container";

describe("<UserGroupsList />", () => {
  let component;
  const dataLength = 30;
  const data = Array.from({ length: dataLength }, (_, i) => ({
    id: i + 1,
    unique_id: `usergroup-${i + 1}`,
    name: `User Group ${i + 1}`,
    description: `Test description ${i + 1}`
  }));

  beforeEach(() => {
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

    ({ component } = setupMountedComponent(UserGroupsList, {}, initialState, [
      `/admin/${NAMESPACE}`
    ]));
  });

  it("should render record list table", () => {
    expect(component.find(IndexTable)).to.have.length(1);
  });

  it("should trigger a valid action with next page when clicking next page", () => {
    const indexTable = component.find(IndexTable);
    const expectAction = {
      api: {
        params: { total: dataLength, per: 20, page: 2 },
        path: NAMESPACE
      },
      type: `${NAMESPACE}/USER_GROUPS`
    };

    expect(indexTable.find("p").at(1).text()).to.be.equals(
      `1-20 of ${dataLength}`
    );
    expect(component.props().store.getActions()).to.have.lengthOf(2);
    indexTable.find("#pagination-next").at(0).simulate("click");

    expect(indexTable.find("p").at(1).text()).to.be.equals(
      `21-${dataLength} of ${dataLength}`
    );
    expect(component.props().store.getActions()[2]).to.deep.equals(
      expectAction
    );
  });
});
