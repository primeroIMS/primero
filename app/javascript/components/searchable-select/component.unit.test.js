import { expect } from "chai";

import { setupMountedComponent } from "../../test";

import CustomAutoComplete from "./components/custom-auto-complete";
import SearchableSelect from "./component";

describe("<SearchableSelect />", () => {
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
    ({ component } = setupMountedComponent(SearchableSelect, props));
  });

  it("renders CustomAutoComplete", () => {
    expect(component.find(CustomAutoComplete)).to.have.length(1);
  });
});
