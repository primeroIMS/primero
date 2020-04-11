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
    },
    options: [{ value: "user-1", label: "User 1" }],
    data: { value: "user-1", label: "User 1 fr" }
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(MultiValue, props));
  });

  it("renders Chip", () => {
    expect(component.find(Chip)).to.have.length(1);
  });

  it("renders Chip with correct children", () => {
    expect(component.find(Chip).text()).to.be.equal("User 1");
  });

  it("renders valid props", () => {
    const singleValueProps = { ...component.find(MultiValue).props() };

    [
      "children",
      "isFocused",
      "innerProps",
      "selectProps",
      "removeProps",
      "options",
      "data"
    ].forEach(property => {
      expect(singleValueProps).to.have.property(property);
      delete singleValueProps[property];
    });

    expect(singleValueProps).to.be.empty;
  });
});
