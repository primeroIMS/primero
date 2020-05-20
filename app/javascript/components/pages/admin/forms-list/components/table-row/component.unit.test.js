import React from "react";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { setupMountedComponent } from "../../../../../../test";
import DragIndicator from "../drag-indicator";

import TableRow from "./component";

describe("<FormsList />/components/<TableRow />", () => {
  let component;

  const props = {
    name: "Form Section 1",
    modules: [
      {
        unique_id: "primeromodule-cp",
        name: "CP",
        associated_record_types: ["case", "tracing_request", "incident"]
      }
    ],
    parentForm: "case",
    index: 1,
    uniqueID: "form",
    editable: true,
    id: 1
  };

  beforeEach(() => {
    const RenderTableRow = () => (
      <DragDropContext>
        <Droppable droppableId="droppable" type="formSection">
          {provided => (
            <div ref={provided.innerRef}>
              <TableRow {...props} />
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );

    ({ component } = setupMountedComponent(RenderTableRow, {}));
  });

  it("renders Draggable component", () => {
    expect(component.find(Draggable)).to.have.lengthOf(1);
  });

  it("renders <DragIndicator />", () => {
    expect(component.find(DragIndicator)).to.have.lengthOf(1);
  });

  it("renders row information", () => {
    expect(component.find(Link).text()).to.equal("Form Section 1");
  });
});
