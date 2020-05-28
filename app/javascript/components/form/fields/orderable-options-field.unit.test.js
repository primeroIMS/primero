import { FormContext } from "react-hook-form";
import { Button } from "@material-ui/core";

import { setupMockFormComponent } from "../../../test";
import DraggableOption from "../components/draggable-option";
import FormAction from "../components/form-action";

import OrderableOptionsField from "./orderable-options-field";

describe("<Form /> - fields/<OrderableOptionsField />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMockFormComponent(OrderableOptionsField, {
      inputProps: {
        commonInputProps: { name: "field_1" },
        metaInputProps: { selectedValue: "option_2" },
        options: [
          { id: "option_1", display_text: "Display text 1" },
          { id: "option_2", display_text: "Display text 2" },
          { id: "option_3", display_text: "Display text 3" }
        ]
      }
    }));
  });

  it("renders the options", () => {
    expect(component.find(DraggableOption)).to.have.lengthOf(3);
  });

  it("render the values for the field", () => {
    const expected = {
      "field_1.selected_value": "option_2",
      "field_1.option_strings_text.en[0].display_text": "Display text 1",
      "field_1.option_strings_text.en[0].id": "option_1",
      "field_1.option_strings_text.en[1].display_text": "Display text 2",
      "field_1.option_strings_text.en[1].id": "option_2",
      "field_1.option_strings_text.en[2].display_text": "Display text 3",
      "field_1.option_strings_text.en[2].id": "option_3"
    };
    const formContext = component.find(FormContext);
    const values = formContext.props().getValues();

    expect(values).to.deep.equal(expected);
  });

  it("renders the action buttons", () => {
    expect(component.find(FormAction)).to.have.lengthOf(1);
    expect(component.find(Button)).to.have.lengthOf(1);
  });
});
