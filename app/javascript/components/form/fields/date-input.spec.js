import { screen, mountedFieldComponent } from "test-utils";

import DateInput from "./date-input";

describe("<Form /> - fields/<DateInput />", () => {
  it("renders text input", () => {
    mountedFieldComponent(<DateInput />);
    expect(document.querySelector(`input[name="test_field_2"]`)).toBeInTheDocument();
  });

  it("renders help text", () => {
    mountedFieldComponent(<DateInput />);
    expect(screen.getByText("Test Field 2 help text")).toBeInTheDocument();
  });

  it("renders errors", () => {
    mountedFieldComponent(<DateInput />, {
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
    mountedFieldComponent(<DateInput />);
    expect(screen.getByRole("textbox", { required: true })).toBeInTheDocument();
  });
});
