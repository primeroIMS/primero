import { screen, mountedFieldComponent } from "test-utils";

import SelectInput from "./select-input";

describe("<Form /> - fields/<SelectInput />", () => {
  it("renders help text", () => {
    mountedFieldComponent(<SelectInput />);
    expect(screen.getByText("Test Field 2 help text")).toBeInTheDocument();
  });

  it("renders errors", () => {
    mountedFieldComponent(<SelectInput />, {
      errors: [
        {
          name: "test_field_2",
          message: "Name is required"
        }
      ]
    });

    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });

  it("renders required indicator", () => {
    mountedFieldComponent(<SelectInput />);
    expect(screen.getAllByText("*")).toBeTruthy();
  });

  it("should autoFocus when prop set", () => {
    mountedFieldComponent(<SelectInput />);
    expect(screen.getByRole("combobox", { autoFocus: true })).toBeInTheDocument();
  });
});
