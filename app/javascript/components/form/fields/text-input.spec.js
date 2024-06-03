import { screen, mountedFieldComponent } from "test-utils";

import TextInput from "./select-input";

describe("<Form /> - fields/<SelectInput />", () => {
  it("renders switch input", () => {
    mountedFieldComponent(<TextInput />);
    expect(screen.getAllByText("Test Field 2")).toBeTruthy();
  });

  it("renders help text", () => {
    mountedFieldComponent(<TextInput />);
    expect(screen.getByText("Test Field 2 help text")).toBeInTheDocument();
  });

  it("renders errors", () => {
    mountedFieldComponent(<TextInput />, {
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
    mountedFieldComponent(<TextInput />);
    expect(screen.getAllByText("*")).toBeTruthy();
  });

  it("should autoFocus when prop set", () => {
    mountedFieldComponent(<TextInput />);
    expect(screen.getByRole("textbox", { autoFocus: true })).toBeInTheDocument();
  });
});
