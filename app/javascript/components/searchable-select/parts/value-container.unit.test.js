
import { expect } from "chai";
import { setupMountedComponent } from "../../../test";
import Chip from "@material-ui/core/Chip";
import ValueContainer from "./value-container";

describe("<ValueContainer />", () => {
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
    ({ component } = setupMountedComponent(ValueContainer, props));
  });

  it("renders div", () => {
    expect(component.find("div")).to.have.length(1);
  });
});
