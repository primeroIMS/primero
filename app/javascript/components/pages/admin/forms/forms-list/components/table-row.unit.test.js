import { setupMountedComponent, expect } from "../../../../../../test";

import TableRow from "./table-row";

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
    uniqueID: "form"
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(TableRow, props));
  });

  // TODO: Fill out once figure out Droppable context issue concerning testing

  xit("renders Draggable component", () => {});

  xit("renders <DragIndicator />", () => {});

  xit("renders row information", () => {
    expect(component.contains("Form Section 1")).to.equal(true);
  });
});
