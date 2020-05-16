import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography
} from "@material-ui/core";

import { setupMountedComponent } from "../../../../../../test";
import DragIndicator from "../drag-indicator";

import FormGroup from "./component";

describe("<FormsList />/components/<FormGroup />", () => {
  let component;

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

  beforeEach(() => {
    ({ component } = setupMountedComponent(RenderFormGroup, {}));
  });

  it("renders <ExpansionPanel />", () => {
    expect(component.find(ExpansionPanel)).to.have.lengthOf(1);
  });

  it("renders <DragIndicator />", () => {
    expect(component.find(DragIndicator)).to.have.lengthOf(1);
  });

  it("renders children", () => {
    expect(component.find(Typography)).to.have.lengthOf(1);
  });

  it("renders panel name", () => {
    expect(component.find(ExpansionPanelSummary).text()).to.equal("Group 1");
  });
});
