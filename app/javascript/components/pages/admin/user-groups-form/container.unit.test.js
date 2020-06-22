import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";
import { WRITE_RECORDS } from "../../../../libs/permissions";
import { FormAction } from "../../../form";

import UserGroupsForm from "./container";

describe("<UserGroupsForm />", () => {
  let component;

  beforeEach(() => {
    const initialState = fromJS({
      records: {
        user_groups: {
          data: [
            {
              id: 1,
              unique_id: "usergroup-test",
              name: "Test",
              description: "Default Test usergroup",
              core_resource: false
            }
          ],
          metadata: { total: 1, per: 20, page: 1 }
        }
      },
      application: {
        agencies: [{ id: 1, unique_id: "agency-unicef", name: "UNICEF" }]
      },
      user: {
        permissions: {
          user_groups: [WRITE_RECORDS]
        }
      }
    });

    ({ component } = setupMountedComponent(
      UserGroupsForm,
      { mode: "new" },
      initialState,
      ["/admin/user_groups"]
    ));
  });

  it("renders record form", () => {
    expect(component.find("form")).to.have.length(1);
  });

  it("renders heading with action buttons", () => {
    expect(component.find("header h1").contains("user_groups.label")).to.be
      .true;
    expect(component.find("header button").at(0).contains("buttons.cancel")).to
      .be.true;
    expect(component.find("header button").at(1).contains("buttons.save")).to.be
      .true;
  });

  it("renders submit button with valid props", () => {
    const saveButton = component.find(FormAction).at(1);
    const saveButtonProps = { ...saveButton.props() };

    expect(saveButton).to.have.lengthOf(1);
    ["actionHandler", "text", "savingRecord", "startIcon"].forEach(property => {
      expect(saveButtonProps).to.have.property(property);
      delete saveButtonProps[property];
    });
    expect(saveButtonProps).to.be.empty;
  });
});
