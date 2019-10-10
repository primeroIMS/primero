import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import MenuItem from "@material-ui/core/MenuItem";
import Option from "./option";

describe("<Option />", () => {
  let component;

  const props = {
    children: "Test",
    isFocused: false,
    isSelected: false,
    innerProps: {
      id: "test",
      tabIndex: 0,
      onMouseOver: () => {},
      onMouseDown: () => {},
      onMouseMove: () => {},
      onClick: () => {}
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
    ({ component } = setupMountedComponent(Option, props));
  });

  it("renders MenuItem", () => {
    expect(component.find(MenuItem)).to.have.length(1);
  });
});
