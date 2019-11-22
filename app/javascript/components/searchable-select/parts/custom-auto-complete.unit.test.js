import { expect } from "chai";
import NoSsr from "@material-ui/core/NoSsr";
import ReactSelect from "react-select";

import { setupMountedComponent } from "../../../test";

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
    excludeEmpty: false,
    options: [{ label: "test", value: "Test Value" }]
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(CustomAutoComplete, { props }));
  });

  it("renders NoSsr", () => {
    expect(component.find(NoSsr)).to.have.length(1);
  });

  it("renders ReactSelect", () => {
    expect(component.find(ReactSelect)).to.have.length(1);
  });

  it("renders a single option and defaultValue prop if excludeEmpty is true", () => {
    const reactSelect = component.find(ReactSelect).props();

    expect(reactSelect).to.have.property("defaultValue");
    expect(reactSelect).to.have.property("options");
    expect(reactSelect.options).to.have.lengthOf(2);
  });

  it("renders two options and defaultValue prop if excludeEmpty is false", () => {
    const reactSelect = component.find(ReactSelect).props();

    expect(reactSelect).to.have.property("defaultValue");
    expect(reactSelect).to.have.property("options");
    expect(reactSelect.options).to.have.lengthOf(2);
  });
});
