// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedFormComponent, screen } from "../../../../test-utils";

import SearchBox from "./component";

describe("<SearchBox /> index-filters/components/search-box", () => {
  const props = {
    recordType: "cases"
  };

  it("renders IconButton", () => {
    mountedFormComponent(<SearchBox {...props} />, { includeFormProvider: true });

    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("renders InputBase", () => {
    mountedFormComponent(<SearchBox {...props} />, { includeFormProvider: true });

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders FieldLabel", () => {
    const fieldLabelProps = {
      ...props,
      searchFieldLabel: "This is a label"
    };

    mountedFormComponent(<SearchBox {...fieldLabelProps} />, { includeFormProvider: true });

    expect(screen.queryByText("This is a label")).toBeInTheDocument();
  });

  it("when SearchNameToggle is true ", () => {
    const seachNameToggleProps = {
      ...props,
      showSearchNameToggle: true
    };

    mountedFormComponent(<SearchBox {...seachNameToggleProps} />, { includeFormProvider: true });

    expect(screen.queryByText("navigation.phonetic_search.label")).toBeInTheDocument();
  });

  it("when SearchNameToggle is false", () => {
    const seachNameToggleProps = {
      ...props,
      showSearchNameToggle: false
    };

    mountedFormComponent(<SearchBox {...seachNameToggleProps} />, { includeFormProvider: true });

    expect(screen.queryByText("navigation.phonetic_search.label")).not.toBeInTheDocument();
  });
});
