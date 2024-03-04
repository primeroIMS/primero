import { mountedComponent, screen } from "test-utils";

import CustomFieldDialog from "./component";

describe("<CustomFieldDialog />", () => {
  const initialState = {
    ui: {
      dialogs: {
        dialog: "custom_field_dialog",
        open: true
      }
    },
    records: {
      admin: {
        forms: {
          selectedSubformField: {}
        }
      }
    }
  };

  beforeEach(() => {
    mountedComponent(<CustomFieldDialog />, initialState);
  });

  it("should render the CustomFieldDialog component", () => {
    expect(screen.getByText("fields.add_existing_field")).toBeInTheDocument();
  });

  describe("When is a called from a subform", () => {
    const initialStateSubform = {
      ui: {
        dialogs: {
          dialog: "custom_field_dialog",
          open: true
        }
      },
      records: {
        admin: {
          forms: {
            selectedSubformField: {
              id: 20,
              description: {
                en: "Family Details Subform"
              },
              unique_id: "family_details_section",
              type: "subform",
              fields: []
            }
          }
        }
      }
    };

    beforeEach(() => {
      mountedComponent(<CustomFieldDialog />, initialStateSubform);
    });

    it("should render only 3 ActionButton", () => {
      expect(screen.getAllByText("fields.add_field")).toBeTruthy();
      expect(screen.getAllByText("fields.add_new_field")).toBeTruthy();
      expect(screen.getAllByText("fields.add_existing_field")).toBeTruthy();
      expect(screen.getAllByText("buttons.cancel")).toBeTruthy();
    });
  });
});
