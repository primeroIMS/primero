import { expect } from "chai";
import Typography from "@material-ui/core/Typography";

import { setupMountedComponent } from "../../../test";

import Placeholder from "./placeholder";

describe("<Placeholder />", () => {
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
    ({ component } = setupMountedComponent(Placeholder, props));
  });

  it("renders Typography", () => {
    expect(component.find(Typography)).to.have.length(1);
  });
});
