import { fromJS } from "immutable";
import { Button, TableCell, TableHead } from "@material-ui/core";

import { setupMountedComponent, lookups, stub } from "../../../../test";
import IndexTable from "../../../index-table";
import { ACTIONS } from "../../../../libs/permissions";
import ActionButton from "../../../action-button";

import RolesList from "./container";

describe("<RolesList />", () => {
  let stubI18n = null;
  let component;

  const dataLength = 30;
  const data = Array.from({ length: dataLength }, (_, i) => ({
    id: i + 1,
    unique_id: `roles-${i + 1}`,
    name: `Role ${i + 1}`,
    description: `Test description ${i + 1}`
  }));

  beforeEach(() => {
    const initialState = fromJS({
      records: {
        admin: {
          roles: {
            data,
            metadata: { total: dataLength, per: 20, page: 1 },
            loading: false,
            errors: false
          }
        }
      },
      user: {
        permissions: {
          roles: [ACTIONS.MANAGE]
        }
      },
      forms: {
        options: {
          lookups: lookups()
        }
      }
    });

    stubI18n = stub(window.I18n, "t")
      .withArgs("messages.record_list.of")
      .returns("of")
      .withArgs("buttons.new")
      .returns("New");

    ({ component } = setupMountedComponent(RolesList, {}, initialState, ["/admin/roles"]));
  });

  it("renders record list table", () => {
    expect(component.find(IndexTable)).to.have.lengthOf(1);
  });

  it("should trigger a sort action when a header is clicked", () => {
    const indexTable = component.find(IndexTable);

    const expectedAction = {
      payload: {
        recordType: "roles",
        data: fromJS({
          disabled: ["false"],
          per: 20,
          order: "asc",
          order_by: "name",
          page: 1
        })
      },
      type: "roles/SET_ROLES_FILTER"
    };

    indexTable.find(TableHead).find(TableCell).at(0).find("span.MuiButtonBase-root").simulate("click");

    expect(component.props().store.getActions()[2].type).to.deep.equals(expectedAction.type);
    expect(component.props().store.getActions()[2].payload.data).to.deep.equals(expectedAction.payload.data);
  });

  it("should trigger a valid action with next page when clicking next page", () => {
    const indexTable = component.find(IndexTable);
    const expectAction = {
      api: {
        params: fromJS({ per: 20, page: 2, managed: true, disabled: ["false"] }),
        path: "roles"
      },
      type: "roles/ROLES"
    };

    expect(indexTable.find("p").at(1).text()).to.be.equals(`1-20 of ${dataLength}`);
    expect(component.props().store.getActions()).to.have.lengthOf(2);
    indexTable.find("#pagination-next").at(0).simulate("click");

    expect(indexTable.find("p").at(1).text()).to.be.equals(`21-${dataLength} of ${dataLength}`);
    expect(component.props().store.getActions()[3].api.params).to.deep.equal(expectAction.api.params);
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
      type: "roles/SET_ROLES_FILTER"
    };

    expect(component.props().store.getActions()[3]).to.deep.equals(expectedAction);
  });

  it("should render new button", () => {
    const newButton = component.find(ActionButton).at(0);

    expect(newButton.text()).to.be.equals("New");
    expect(newButton).to.have.lengthOf(1);
  });

  describe("when user can't create role", () => {
    let componentWithoutManage;

    beforeEach(() => {
      const initialState = fromJS({
        records: {
          admin: {
            roles: {
              data,
              metadata: { total: dataLength, per: 20, page: 1 },
              loading: false,
              errors: false
            }
          }
        },
        user: {
          permissions: {
            roles: [ACTIONS.READ]
          }
        },
        forms: {
          options: {
            lookups: lookups()
          }
        }
      });

      ({ component: componentWithoutManage } = setupMountedComponent(RolesList, {}, initialState, ["/admin/roles"]));
    });
    it("should not render new button", () => {
      expect(componentWithoutManage.find(ActionButton)).to.empty;
    });
  });

  afterEach(() => {
    if (stubI18n) {
      window.I18n.t.restore();
    }
  });
});
