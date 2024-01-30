import { screen, setupMockFieldComponent } from "test-utils";

import { FieldRecord } from "../records";

import SwitchInput from "./switch-input";

describe("<Form /> - fields/<SelectInput />", () => {
  it("renders switch input", () => {
    setupMockFieldComponent(SwitchInput, FieldRecord);
    expect(screen.getByText("Test Field 2")).toBeInTheDocument();
  });

  it("renders help text", () => {
    setupMockFieldComponent(SwitchInput, FieldRecord);
    expect(screen.getByText("Test Field 2 help text")).toBeInTheDocument();
  });

  it("renders errors", () => {
    setupMockFieldComponent(SwitchInput, FieldRecord, {}, {}, {}, null, [
      {
        name: "test_field_2",
        message: "Name is required"
      }
    ]);
    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });
});
