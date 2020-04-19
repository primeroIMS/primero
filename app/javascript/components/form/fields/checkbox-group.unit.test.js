import { Checkbox } from "@material-ui/core";

import { FieldRecord } from "../records";
import { setupMockFieldComponent } from "../../../test";

import CheckboxGroup from "./checkbox-group";

describe("<Form /> - fields/<CheckBoxGroup />", () => {
  const options = [
    { id: 1, display_text: "option-1" },
    { id: 2, display_text: "option-2" }
  ];

  it("renders checkbox inputs", () => {
    const { component } = setupMockFieldComponent(
      CheckboxGroup,
      FieldRecord,
      {},
      { options, value: [1], onChange: () => {} }
    );

    expect(component.find(Checkbox)).to.have.lengthOf(2);
    expect(
      component
        .find(Checkbox)
        .map(checkbox => checkbox.props().checked)
        .filter(checked => checked === true)
    ).to.have.lengthOf(1);
  });
});
