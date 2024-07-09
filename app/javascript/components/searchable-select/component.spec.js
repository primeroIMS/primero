// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
import { mountedComponent, screen } from "test-utils";

import SearchableSelect from "./component";

describe("<SearchableSelect />", () => {
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
    mountedComponent(<SearchableSelect {...props} />);
  });

  it("renders Autocomplete", () => {
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
