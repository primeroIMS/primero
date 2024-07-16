// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
import { screen, mountedFormComponent } from "test-utils";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import DraggableOption from "./component";

describe("<Form /> - components/<DraggableOption />", () => {
  beforeEach(() => {
    // eslint-disable-next-line react/display-name
    function Component(props) {
      return (
        <DragDropContext>
          <Droppable droppableId="droppable" type="field">
            {() => (
              <DraggableOption
                name="field_1"
                index={0}
                option={{ id: "option_1", display_text: "Display text 1", disabled: false }}
                defaultOptionId="option_1"
                {...props}
              />
            )}
          </Droppable>
        </DragDropContext>
      );
    }

    mountedFormComponent(<Component mode="edit" />);
  });

  it("renders a TextInput for display_text", () => {
    expect(document.querySelector("input[name='field_1.option_strings_text[0].display_text.en'")).toBeInTheDocument();
  });

  it("renders a SwitchInput", () => {
    expect(screen.getByTestId("switch-input")).toBeInTheDocument();
  });
});
