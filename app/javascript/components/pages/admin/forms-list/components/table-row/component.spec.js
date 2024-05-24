// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
import { mountedComponent, screen } from "test-utils";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import TableRow from "./component";

describe("<FormsList />/components/<TableRow />", () => {
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

    RenderTableRow.displayName = "RenderTableRow";
    mountedComponent(<RenderTableRow />);
  });

  it("renders <Droppable/>", () => {
    expect(screen.getByTestId("error-icon")).toBeInTheDocument();
  });

  it("renders <TableRow/>", () => {
    expect(screen.getByText("Form Section 1")).toBeInTheDocument();
  });
});
