import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";

import ClearButtons from "./component";

describe("<ClearButtons />", () => {
  const state = fromJS({
    ui: { dialogs: { admin_fields_dialog: true } }
  });

  it("renders the clear group by button if subform_group_by is set", () => {
    const props = {
      subformField: fromJS({ name: "field_1" }),
      subformGroupBy: "field_2"
    };
    const defaultValues = {
      field_1: { subform_section_configuration: { subform_group_by: "field_2" } }
    };

    mountedComponent(<ClearButtons {...props} />, state, defaultValues);

    expect(screen.getByText("fields.clear_group_by")).toBeInTheDocument();
  });

  it("renders the clear sort by button if subform_sort_by is set", () => {
    const props = {
      subformField: fromJS({ name: "field_1" }),
      subformSortBy: "field_2"
    };
    const defaultValues = {
      field_1: { subform_section_configuration: { subform_group_by: "field_2" } }
    };

    mountedComponent(<ClearButtons {...props} />, state, defaultValues);

    expect(screen.getByText("fields.clear_sort_by")).toBeInTheDocument();
  });
});
