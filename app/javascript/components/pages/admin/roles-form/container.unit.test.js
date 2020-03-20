import { fromJS } from "immutable";

import { setupMountedComponent, expect } from "../../../../test";
import { ACTIONS } from "../../../../libs/permissions";

import RolesForm from "./container";

describe("<RolesForm />", () => {
  let component;

  beforeEach(() => {
    const initialState = fromJS({
      records: {
        roles: {
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

    ({ component } = setupMountedComponent(
      RolesForm,
      { mode: "new" },
      initialState,
      ["/admin/roles"]
    ));
  });

  it("renders role form", () => {
    expect(component.find("form")).to.have.length(1);
  });

  it("renders heading with action buttons", () => {
    expect(component.find("header h1").contains("roles.label")).to.be.true;
    expect(
      component
        .find("header button")
        .at(0)
        .contains("buttons.cancel")
    ).to.be.true;
    expect(
      component
        .find("header button")
        .at(1)
        .contains("buttons.save")
    ).to.be.true;
  });
});
