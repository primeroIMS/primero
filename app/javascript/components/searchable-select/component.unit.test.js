import Autocomplete from "@material-ui/lab/Autocomplete";

import { setupMountedComponent } from "../../test";

import SearchableSelect from "./component";

describe("<SearchableSelect />", () => {
  let component;
  const props = {
    id: "userAutocomplete",
    name: "name_test",
    onChange: () => {},
    TextFieldProps: {
      label: "Test",
      InputLabelProps: {
        htmlFor: "userAutocomplete",
        shrink: true
      }
    },
    options: [
      { label: "test", value: "Test Value" },
      { label: "test1", value: "Test Value 1" },
      { label: "test2", value: "Test Value 2" }
    ]
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(SearchableSelect, props));
  });

  it("renders Autocomplete", () => {
    expect(component.find(Autocomplete)).to.have.length(1);
    expect(component.find(Autocomplete).props().options).to.have.length(3);
  });
});
