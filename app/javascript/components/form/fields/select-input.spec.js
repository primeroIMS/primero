import { screen, setupMockFieldComponent } from "test-utils";

import { FieldRecord } from "../records";

import SelectInput from "./select-input";

describe("<Form /> - fields/<SelectInput />", () => {
  it("renders help text", () => {
    setupMockFieldComponent(SelectInput, FieldRecord);
    expect(screen.getByText("Test Field 2 help text")).toBeInTheDocument();
  });

  it("renders errors", () => {
    setupMockFieldComponent(SelectInput, FieldRecord, {}, {}, {}, null, [
      {
        name: "test_field_2",
        message: "Name is required"
      }
    ]);
    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });

  it("renders required indicator", () => {
    setupMockFieldComponent(SelectInput, FieldRecord);
    expect(screen.getAllByText("*")).toBeTruthy();
  });

  it("should autoFocus when prop set", () => {
    setupMockFieldComponent(SelectInput, FieldRecord);
    expect(screen.getByRole("textbox", { autoFocus: true })).toBeInTheDocument();
  });
});
