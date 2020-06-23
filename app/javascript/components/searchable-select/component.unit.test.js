import Autocomplete from "@material-ui/lab/Autocomplete";

import { setupMountedComponent } from "../../test";

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

  it("renders Autocomplete", () => {
    expect(component.find(Autocomplete)).to.have.length(1);
  });
});
