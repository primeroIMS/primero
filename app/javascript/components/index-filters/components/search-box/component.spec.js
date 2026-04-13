// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedFormComponent, screen } from "../../../../test-utils";

import SearchBox from "./component";

describe("<SearchBox /> index-filters/components/search-box", () => {
  const props = {
    recordType: "case"
  };

  it("renders search actions", () => {
    mountedFormComponent(<SearchBox {...props} />, { includeFormProvider: true });

    expect(screen.getByTestId("search-actions")).toBeInTheDocument();
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

  describe("when showFieldToggle", () => {
    it("is true it renders SearchFieldToggle", () => {
      const seachNameToggleProps = {
        ...props,
        showFieldToggle: true
      };

      mountedFormComponent(<SearchBox {...seachNameToggleProps} />, {
        includeFormProvider: true
      });

      expect(screen.getByTestId("search-field-toggle")).toBeInTheDocument();
    });

    it("is false it should not render showFieldToggle", () => {
      const seachNameToggleProps = {
        ...props,
        showFieldToggle: false
      };

      mountedFormComponent(<SearchBox {...seachNameToggleProps} />, {
        includeFormProvider: true
      });

      expect(screen.queryByTestId("search-field-toggle")).not.toBeInTheDocument();
    });
  });
});
