import { screen, setupMockFieldComponent } from "test-utils";

import { FieldRecord } from "../records";

import CheckboxInput from "./checkbox-input";
import DateInput from "./date-input";

describe("<Form /> - fields/<DateInput />", () => {
  it("renders text input", () => {
    setupMockFieldComponent(DateInput, FieldRecord);
    expect(document.querySelector(`input[name="test_field_2"]`)).toBeInTheDocument();
  });

  it("renders help text", () => {
    setupMockFieldComponent(CheckboxInput, FieldRecord);
    expect(screen.getByText("Test Field 2 help text")).toBeInTheDocument();
  });

  it("renders errors", () => {
    setupMockFieldComponent(CheckboxInput, FieldRecord, {}, {}, {}, null, [
      {
        name: "test_field_2",
        message: "Name is required"
      }
    ]);
    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });

  it("renders required indicator", () => {
    setupMockFieldComponent(CheckboxInput, FieldRecord);
    expect(screen.getByText("*")).toBeInTheDocument();
  });
});
