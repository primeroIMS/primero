import { fromJS } from "immutable";

import { setupMountedComponent, lookups } from "../../../../test";
import IndexTable from "../../../index-table";
import { ACTIONS } from "../../../../libs/permissions";
import ActionButton from "../../../action-button";

import RolesList from "./container";

describe("<RolesList />", () => {
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

    ({ component } = setupMountedComponent(RolesList, {}, initialState, ["/admin/roles"]));
  });

  it("renders record list table", () => {
    expect(component.find(IndexTable)).to.have.lengthOf(1);
  });

  it("should trigger a valid action with next page when clicking next page", () => {
    const indexTable = component.find(IndexTable);
    const expectAction = {
      api: {
        params: { per: 20, page: 2 },
        path: "roles"
      },
      type: "roles/ROLES"
    };

    expect(indexTable.find("p").at(1).text()).to.be.equals(`1-20 of ${dataLength}`);
    expect(component.props().store.getActions()).to.have.lengthOf(2);
    indexTable.find("#pagination-next").at(0).simulate("click");

    expect(indexTable.find("p").at(1).text()).to.be.equals(`21-${dataLength} of ${dataLength}`);
    expect(component.props().store.getActions()[2]).to.deep.equals(expectAction);
  });

  it("should render new button", () => {
    const newButton = component.find(ActionButton);

    expect(newButton.text()).to.be.equals("buttons.new");
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
});
