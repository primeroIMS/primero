import { fromJS } from "immutable";
import { Button } from "@material-ui/core";

import { setupMockFormComponent } from "../../../../../../test";

import ClearButtons from "./component";

describe("<ClearButtons />", () => {
  const state = fromJS({
    ui: { dialogs: { admin_fields_dialog: true } }
  });

  it("should render the ClearButtons component", () => {
    const props = {
      subformField: fromJS({ name: "field_1" }),
      subformGroupBy: "field_2",
      subformSortBy: "field_2"
    };

    const { component } = setupMockFormComponent(ClearButtons, { props, state });

    expect(component.find(ClearButtons)).to.have.lengthOf(1);
  });

  it("renders the clear group by button if subform_group_by is set", () => {
    const props = {
      subformField: fromJS({ name: "field_1" }),
      subformGroupBy: "field_2"
    };
    const { component } = setupMockFormComponent(ClearButtons, {
      props,
      state,
      defaultValues: {
        field_1: { subform_section_configuration: { subform_group_by: "field_2" } }
      }
    });
    const groupButton = component.find(Button);

    expect(groupButton).to.have.lengthOf(1);
    expect(groupButton.text()).to.equal("fields.clear_group_by");
  });

  it("renders the clear sort by button if subform_sort_by is set", () => {
    const props = {
      subformField: fromJS({ name: "field_1" }),
      subformSortBy: "field_2"
    };

    const { component } = setupMockFormComponent(ClearButtons, {
      props,
      state,
      defaultValues: {
        field_1: { subform_section_configuration: { subform_group_by: "field_2" } }
      }
    });
    const groupButton = component.find(Button);

    expect(groupButton).to.have.lengthOf(1);
    expect(groupButton.text()).to.equal("fields.clear_sort_by");
  });
});
