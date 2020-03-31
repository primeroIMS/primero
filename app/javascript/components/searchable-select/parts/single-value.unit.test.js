import { expect } from "chai";
import Typography from "@material-ui/core/Typography";

import { setupMountedComponent } from "../../../test";
import ActionDialog from "../../action-dialog";

import SingleValue from "./single-value";

describe("<SingleValue />", () => {
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
    ({ component } = setupMountedComponent(SingleValue, props));
  });

  it("renders Typography", () => {
    expect(component.find(Typography)).to.have.length(1);
  });

  it("renders Typography with correct children", () => {
    expect(component.find(Typography).text()).to.be.equal("User 1");
  });

  it("renders valid props", () => {
    const singleValueProps = { ...component.find(SingleValue).props() };

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
