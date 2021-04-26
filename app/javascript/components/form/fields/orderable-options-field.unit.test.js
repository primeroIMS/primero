import { Button } from "@material-ui/core";

import { setupMockFormComponent } from "../../../test";
import DraggableOption from "../components/draggable-option";
import ActionButton from "../../action-button";

import OrderableOptionsField from "./orderable-options-field";

describe("<Form /> - fields/<OrderableOptionsField />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMockFormComponent(OrderableOptionsField, {
      props: {
        inputProps: {
          commonInputProps: { name: "field_1" },
          metaInputProps: { selectedValue: "option_2" }
        }
      },
      defaultValues: {
        field_1: [
          { id: "option_1", display_text: { en: "Display text 1" } },
          { id: "option_2", display_text: { en: "Display text 2" } },
          { id: "option_3", display_text: { en: "Display text 3" } }
        ]
      }
    }));
  });

  it("renders the options", () => {
    expect(component.find(DraggableOption)).to.have.lengthOf(3);
  });

  it("render the values for the field", () => {
    const expected = {
      field_1: {
        option_strings_text: [
          {
            display_text: {
              en: "Display text 1"
            },
            id: "option_1"
          },
          {
            display_text: {
              en: "Display text 2"
            },
            id: "option_2"
          },
          {
            display_text: {
              en: "Display text 3"
            },
            id: "option_3"
          }
        ],
        selected_value: false
      }
    };
    const { formMethods } = component.find(DraggableOption).at(0).props();
    const values = formMethods.getValues();

    expect(values).to.deep.equal(expected);
  });

  it("renders the action buttons", () => {
    expect(component.find(ActionButton)).to.have.lengthOf(2);
    expect(component.find(Button)).to.have.lengthOf(2);
  });
});
