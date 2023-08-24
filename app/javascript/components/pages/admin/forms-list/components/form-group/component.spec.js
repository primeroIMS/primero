import { mountedComponent, screen } from "test-utils";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Typography } from "@material-ui/core";

import FormGroup from "./component";

describe("<FormsList />/components/<FormGroup />", () => {
  const RenderFormGroup = () => (
    <DragDropContext>
      <Droppable droppableId="droppable" type="formGroup">
        {provided => (
          <div ref={provided.innerRef}>
            <FormGroup id="group-1" index={0} name="Group 1">
              <Typography>Some Content</Typography>
            </FormGroup>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );

  RenderFormGroup.displayName = "RenderFormGroup";

  beforeEach(() => {
    mountedComponent(<RenderFormGroup />);
  });

  it("renders panel name", () => {
    expect(screen.getByText("Group 1")).toBeInTheDocument();
  });

  it("renders <DragIndicator />", () => {
    expect(screen.getByTestId("error-icon")).toBeInTheDocument();
  });
});
