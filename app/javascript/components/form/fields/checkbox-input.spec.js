import { screen, setupMockFieldComponent } from "test-utils";

import { FieldRecord } from "../records";

import CheckboxInput from "./checkbox-input";

describe("<Form /> - fields/<SelectInput />", () => {
  const options = [
    { id: 1, display_text: "option-1" },
    { id: 2, display_text: "option-2" }
  ];

  it("renders checkbox inputs", () => {
    setupMockFieldComponent(CheckboxInput, FieldRecord, {}, { options });
    expect(screen.getByText("option-1")).toBeInTheDocument();
    expect(screen.getByText("option-2")).toBeInTheDocument();
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
