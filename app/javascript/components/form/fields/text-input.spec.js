import { screen, setupMockFieldComponent } from "test-utils";

import { FieldRecord } from "../records";

import TextInput from "./select-input";

describe("<Form /> - fields/<SelectInput />", () => {
  it("renders switch input", () => {
    setupMockFieldComponent(TextInput, FieldRecord);
    expect(screen.getAllByText("Test Field 2")).toBeTruthy();
  });

  it("renders help text", () => {
    setupMockFieldComponent(TextInput, FieldRecord);
    expect(screen.getByText("Test Field 2 help text")).toBeInTheDocument();
  });

  it("renders errors", () => {
    setupMockFieldComponent(TextInput, FieldRecord, {}, {}, {}, null, [
      {
        name: "test_field_2",
        message: "Name is required"
      }
    ]);
    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });

  it("renders required indicator", () => {
    setupMockFieldComponent(TextInput, FieldRecord);
    expect(screen.getAllByText("*")).toBeTruthy();
  });

  it("should autoFocus when prop set", () => {
    setupMockFieldComponent(TextInput, FieldRecord);
    expect(screen.getByRole("textbox", { autoFocus: true })).toBeInTheDocument();
  });
});
