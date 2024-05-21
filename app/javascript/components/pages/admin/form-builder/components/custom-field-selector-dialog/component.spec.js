import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import CustomFieldSelectorDialog from "./component";

describe("<CustomFieldSelectorDialog />", () => {
  const initialState = fromJS({
    ui: { dialogs: { dialog: "custom_field_selector_dialog", open: true } }
  });

  beforeEach(() => {
    mountedComponent(<CustomFieldSelectorDialog />, initialState);
  });

  it("should render the CustomFieldSelectorDialog component", () => {
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should render list of fields types", () => {
    expect(screen.getByText("forms.type_label")).toBeInTheDocument();
    expect(screen.getByText("forms.select_label")).toBeInTheDocument();
    expect(screen.getAllByTestId("field").length).toBe(12);
  });
});
