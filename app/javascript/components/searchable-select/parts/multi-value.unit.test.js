import { expect } from "chai";
import Chip from "@material-ui/core/Chip";

import { setupMountedComponent } from "../../../test";

import MultiValue from "./multi-value";

describe("<MultiValue />", () => {
  let component;

  const props = {
    children: "Test",
    isFocused: false,
    innerProps: {
      onMouseDown: () => {},
      onMouseMove: () => {}
    },
    selectProps: {
      id: "Test",
      TextFieldProps: { label: "Test" },
      classes: {
        root: "testStyle"
      }
    },
    removeProps: {
      onMouseDown: () => {},
      onTouchEnd: () => {},
      onClick: () => {}
    }
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(MultiValue, props));
  });

  it("renders Chip", () => {
    expect(component.find(Chip)).to.have.length(1);
  });
});
