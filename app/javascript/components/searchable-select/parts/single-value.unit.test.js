import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import Typography from "@material-ui/core/Typography";
import SingleValue from "./single-value";

describe("<SingleValue />", () => {
  let component;

  const props = {
    children: "Test",
    isFocused: false,
    innerProps: {
      onMouseDown: () => { },
      onMouseMove: () => { }
    },
    selectProps: {
      id: "Test",
      TextFieldProps: { label: "Test" },
      classes: {
        root: "testStyle"
      }
    },
    removeProps: {
      onMouseDown: () => { },
      onTouchEnd: () => { },
      onClick: () => { }
    }
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(SingleValue, props));
  });

  it("renders Typography", () => {
    expect(component.find(Typography)).to.have.length(1);
  });
});
