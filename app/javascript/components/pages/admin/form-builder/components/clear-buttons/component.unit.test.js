import { fromJS } from "immutable";
import { Button } from "@material-ui/core";

import { setupMockFormComponent } from "../../../../../../test";

import ClearButtons from "./component";

describe("<ClearButtons />", () => {
  const initialState = fromJS({
    ui: { dialogs: { admin_fields_dialog: true } }
  });

  const props = {
    subformField: fromJS({ name: "field_1" })
  };

  it("should render the ClearButtons component", () => {
    const { component } = setupMockFormComponent(
      ClearButtons,
      props,
      {},
      initialState
    );

    expect(component.find(ClearButtons)).to.have.lengthOf(1);
  });

  it("renders the clear group by button if subform_group_by is set", () => {
    const { component } = setupMockFormComponent(
      ClearButtons,
      props,
      {},
      initialState,
      { field_1: { subform_group_by: "field_2" } }
    );
    const groupButton = component.find(Button);

    expect(groupButton).to.have.lengthOf(1);
    expect(groupButton.text()).to.equal("fields.clear_group_by");
  });

  it("renders the clear sort by button if subform_sort_by is set", () => {
    const { component } = setupMockFormComponent(
      ClearButtons,
      props,
      {},
      initialState,
      { field_1: { subform_sort_by: "field_2" } }
    );
    const groupButton = component.find(Button);

    expect(groupButton).to.have.lengthOf(1);
    expect(groupButton.text()).to.equal("fields.clear_sort_by");
  });
});
