// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
import { mountedComponent, screen } from "../../../../../../test-utils";

import DraggableRow from "./component";

describe("<DraggableRow /> - components/draggable-row/component", () => {
  const props = {
    firstLocaleOption: false,
    index: 0,
    isDragDisabled: false,
    localesKeys: ["en"],
    onRemoveClick: () => {},
    selectedOption: "en",
    uniqueId: "test"
  };

  // TODO: Fill out once figure out Droppable context issue concerning testing
  it.skip("renders Draggable component", () => {
    mountedComponent(<DraggableRow {...props} />);
    expect(screen.getByTestId("draggable")).toBeInTheDocument();
  });

  it.skip("renders FormSectionField component", () => {
    mountedComponent(<DraggableRow {...props} />);
    expect(screen.getByTestId("form-section-field")).toBeInTheDocument();
  });

  it.skip("renders FormSectionField component", () => {
    mountedComponent(<DraggableRow {...props} />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });
});
