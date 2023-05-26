import { screen, setupMockFormComponent } from "test-utils";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import DraggableOption from "./component";

describe("<Form /> - components/<DraggableOption />", () => {
  const props = {
    mode: "edit"
  };

  beforeEach(() => {
    setupMockFormComponent(
      ({ formMethods, formMode }) => (
        <DragDropContext>
          <Droppable droppableId="droppable" type="field">
            {() => (
              <DraggableOption
                name="field_1"
                index={0}
                option={{ id: "option_1", display_text: "Display text 1", disabled: false }}
                defaultOptionId="option_1"
                formMethods={formMethods}
                formMode={formMode}
              />
            )}
          </Droppable>
        </DragDropContext>
      ),
      { props }
    );
  });

  it("renders a TextInput for display_text", () => {
    expect(document.querySelector("#textinput")).toBeInTheDocument();
  });

  it("renders a SwitchInput", () => {
    expect(screen.getByTestId("SwitchInput")).toBeInTheDocument();
  });
});
