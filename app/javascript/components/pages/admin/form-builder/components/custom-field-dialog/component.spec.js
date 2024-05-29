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
});
