
import { expect } from "chai";
import { setupMountedComponent } from "../../../test";
import TextField from "@material-ui/core/TextField";
import Control from "./control";

describe("<Control />", () => {
  let component;
  const props = {
    children: [],
    innerRef: () => {},
    innerProps: {
      onMouseDown: () => {},
      onMouseMove: () => {}
    },
    selectProps: {
      TextFieldProps: { label: "Recipient" },
      classes: {
        root: "testStyle"
      }
    }
  };
  beforeEach(() => {
    ({ component } = setupMountedComponent(Control, props));
  });

  it("renders TextField", () => {
    expect(component.find(TextField)).to.have.length(1);
  });
});
