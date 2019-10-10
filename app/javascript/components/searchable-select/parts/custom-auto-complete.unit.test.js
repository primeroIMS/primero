import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import NoSsr from "@material-ui/core/NoSsr";
import ReactSelect from "react-select";
import CustomAutoComplete from "./custom-auto-complete";

describe("<CustomAutoComplete />", () => {
  let component;
  const props = {
    id: "userAutocomplete",
    TextFieldProps: {
      label: "Test",
      InputLabelProps: {
        htmlFor: "userAutocomplete",
        shrink: true
      }
    },
    options: [{ label: "test", value: "Test Value" }]
  };
  beforeEach(() => {
    ({ component } = setupMountedComponent(CustomAutoComplete, props));
  });

  it("renders NoSsr", () => {
    expect(component.find(NoSsr)).to.have.length(1);
  });

  it("renders ReactSelect", () => {
    expect(component.find(ReactSelect)).to.have.length(1);
  });
});
