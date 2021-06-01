import { fromJS } from "immutable";
import { Button, TableCell, TableHead } from "@material-ui/core";

import { setupMountedComponent, listHeaders, lookups, stub } from "../../../../test";
import IndexTable from "../../../index-table";
import { ACTIONS } from "../../../../libs/permissions";

import NAMESPACE from "./namespace";
import UserGroupsList from "./container";

describe("<UserGroupsList />", () => {
  let stubI18n = null;
  let component;
  const dataLength = 30;
  const data = Array.from({ length: dataLength }, (_, i) => ({
    id: i + 1,
    unique_id: `usergroup-${i + 1}`,
    name: `User Group ${i + 1}`,
    description: `Test description ${i + 1}`
  }));

  beforeEach(() => {
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

    ({ component } = setupMountedComponent(UserGroupsList, {}, initialState, [`/admin/${NAMESPACE}`]));
  });

  it("should render record list table", () => {
    expect(component.find(IndexTable)).to.have.length(1);
  });

  it("should trigger a sort action when a header is clicked", () => {
    const indexTable = component.find(IndexTable);

    const expectedAction = {
      payload: {
        recordType: "user_groups",
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

    indexTable.find(TableHead).find(TableCell).at(0).find("span.MuiButtonBase-root").simulate("click");

    expect(component.props().store.getActions()[2].type).to.deep.equals(expectedAction.type);
    expect(component.props().store.getActions()[2].payload.data).to.deep.equals(expectedAction.payload.data);
  });

  it("should trigger a valid action with next page when clicking next page", () => {
    const indexTable = component.find(IndexTable);
    const expectAction = {
      api: {
        params: fromJS({ total: dataLength, per: 20, page: 2, disabled: ["false"], managed: true }),
        path: NAMESPACE
      },
      type: `${NAMESPACE}/USER_GROUPS`
    };

    expect(indexTable.find("p").at(1).text()).to.be.equals(`1-20 of ${dataLength}`);
    expect(component.props().store.getActions()).to.have.lengthOf(2);
    indexTable.find("#pagination-next").at(0).simulate("click");

    expect(indexTable.find("p").at(1).text()).to.be.equals(`21-${dataLength} of ${dataLength}`);
    expect(component.props().store.getActions()[3].api.params).to.deep.equals(expectAction.api.params);
    expect(component.props().store.getActions()[3].type).to.deep.equals(expectAction.type);
    expect(component.props().store.getActions()[3].api.path).to.deep.equals(expectAction.api.path);
  });

  it("should set the filters when apply is clicked", () => {
    component.find(Button).at(2).simulate("click");

    const expectedAction = {
      payload: {
        data: fromJS({
          disabled: ["false"]
        })
      },
      type: "user_groups/SET_USER_GROUPS_FILTER"
    };

    expect(component.props().store.getActions()[3]).to.deep.equals(expectedAction);
  });

  afterEach(() => {
    if (stubI18n) {
      window.I18n.t.restore();
    }
  });
});
