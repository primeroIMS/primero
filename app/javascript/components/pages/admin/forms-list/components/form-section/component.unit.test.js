import React from "react";
import { List } from "immutable";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { setupMountedComponent } from "../../../../../../test";
import TableRow from "../table-row";

import FormSection from "./component";

describe("<FormsList />/components/<FormSection />", () => {
  let component;

  beforeEach(() => {
    const group = List([
      {
        name: "Section",
        order: 0,
        module_ids: ["module-1"],
        parent_form: "form_2",
        unique_id: "form_section_1",
        editable: false,
        id: 1
      }
    ]);

    const RenderFormSection = () => (
      <DragDropContext>
        <FormSection group={group} collection="form-1" />
      </DragDropContext>
    );

    ({ component } = setupMountedComponent(RenderFormSection, {}));
  });

  it("renders <Droppable/>", () => {
    expect(component.find(Droppable)).to.have.lengthOf(1);
  });

  it("renders <TableRow/>", () => {
    expect(component.find(TableRow)).to.have.lengthOf(1);
  });
});
