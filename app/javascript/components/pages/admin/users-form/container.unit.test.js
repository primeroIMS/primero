import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";
import { ACTIONS } from "../../../../libs/permissions";
import { FormAction } from "../../../form";

import UsersForm from "./container";

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
      application: {
        agencies: [{ id: 1, unique_id: "agency-unicef", name: "UNICEF" }]
      },
      user: {
        permissions: {
          users: [ACTIONS.MANAGE]
        }
      }
    });

    ({ component } = setupMountedComponent(
      UsersForm,
      { mode: "new" },
      initialState,
      ["/admin/users"]
    ));
  });

  it("renders record form", () => {
    expect(component.find("form")).to.have.length(1);
  });

  it("renders heading with action buttons", () => {
    expect(component.find("header h1").contains("users.label")).to.be.true;
    expect(component.find("header button").at(0).contains("buttons.cancel")).to
      .be.true;
    expect(component.find("header button").at(1).contains("buttons.save")).to.be
      .true;
  });

  it("renders submit button with valid props", () => {
    const saveButtonProps = { ...component.find(FormAction).at(1).props() };

    expect(component.find(saveButtonProps)).to.have.lengthOf(1);
    ["actionHandler", "text", "savingRecord"].forEach(property => {
      expect(saveButtonProps).to.have.property(property);
      delete saveButtonProps[property];
    });
    expect(saveButtonProps).to.be.empty;
  });
});
