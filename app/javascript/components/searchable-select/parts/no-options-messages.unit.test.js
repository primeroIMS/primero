
import { expect } from "chai";
import { setupMountedComponent } from "../../../test";
import Typography from "@material-ui/core/Typography";
import NoOptionsMessage from "./no-options-message";

describe("<NoOptionsMessage />", () => {
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
    ({ component } = setupMountedComponent(NoOptionsMessage, props));
  });

  it("renders Typography", () => {
    expect(component.find(Typography)).to.have.length(1);
  });
});
