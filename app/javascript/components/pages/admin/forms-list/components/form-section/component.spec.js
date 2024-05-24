// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
import { mountedComponent, screen } from "test-utils";
import { List } from "immutable";
import { DragDropContext } from "react-beautiful-dnd";

import FormSection from "./component";

describe("<FormsList />/components/<FormSection />", () => {
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

    RenderFormSection.displayName = "RenderFormSection";
    mountedComponent(<RenderFormSection />);
  });

  it("renders <Droppable/>", () => {
    expect(screen.getByTestId("error-icon")).toBeInTheDocument();
  });

  it("renders <TableRow/>", () => {
    expect(screen.getByText("form_section.form_name")).toBeInTheDocument();
  });
});
