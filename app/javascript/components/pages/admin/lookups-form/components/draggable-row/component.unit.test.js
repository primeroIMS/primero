import { Draggable } from "react-beautiful-dnd";

import FormSectionField from "../../../../../form/components/form-section-field";
import { setupMountedComponent } from "../../../../../../test";

import DraggableRow from "./component";

describe("<DraggableRow /> - components/draggable-row/component", () => {
  let component;
  const props = {
    firstLocaleOption: false,
    index: 0,
    isDragDisabled: false,
    localesKeys: ["en"],
    onRemoveClick: () => {},
    selectedOption: "en",
    uniqueId: "test"
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(DraggableRow, props));
  });

  // TODO: Fill out once figure out Droppable context issue concerning testing
  it.skip("renders Draggable component", () => {
    expect(component.find(Draggable)).to.have.lengthOf(1);
  });

  it.skip("renders FormSectionField component", () => {
    expect(component.find(FormSectionField)).to.have.lengthOf(1);
  });
});
