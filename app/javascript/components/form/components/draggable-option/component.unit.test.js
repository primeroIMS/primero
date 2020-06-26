import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Radio, Checkbox } from "@material-ui/core";

import { setupMockFormComponent } from "../../../../test";
import TextInput from "../../fields/text-input";

import DraggableOption from "./component";

describe("<Form /> - components/<DraggableOption />", () => {
  let component;
  const props = {
    mode: "edit"
  };

  beforeEach(() => {
    ({ component } = setupMockFormComponent(
      () => (
        <DragDropContext>
          <Droppable droppableId="droppable" type="field">
            {() => (
              <DraggableOption
                name="field_1"
                index={0}
                option={{ id: "option_1", display_text: "Display text 1" }}
                defaultOptionId="option_1"
              />
            )}
          </Droppable>
        </DragDropContext>
      ),
      props
    ));
  });

  it("renders a TextInput for display_text", () => {
    expect(component.find(TextInput)).to.have.lengthOf(1);
  });

  it("renders a checked RadioButton", () => {
    const selectedValueRadio = component.find(Radio);

    expect(selectedValueRadio).to.have.lengthOf(1);
    expect(selectedValueRadio.props().checked).to.be.true;
  });

  it("renders a checked RadioButton", () => {
    const selectedValueCheckbox = component.find(Checkbox);

    expect(selectedValueCheckbox).to.be.exist;
  });
});
