import { fromJS } from "immutable";

import { setupMockFormComponent } from "../../../../../../test";

import ExistingFieldDialog from "./component";

describe("<ExistingFieldDialog />", () => {
  const state = fromJS({
    ui: { dialogs: { admin_fields_dialog: true } },
    records: {
      admin: {
        forms: {
          selectedFields: [
            {
              id: 1,
              name: "field_1",
              display_name: { en: "Field 1" }
            },
            {
              id: 2,
              name: "field_2",
              display_name: { en: "Field 2" }
            }
          ]
        }
      }
    }
  });

  it("should render the dialog", () => {
    const { component } = setupMockFormComponent(ExistingFieldDialog, {
      props: { parentForm: "parent", primeroModule: "module-1" },
      state
    });

    expect(component.find(ExistingFieldDialog)).to.have.lengthOf(1);
  });
});
