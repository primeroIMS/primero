import { screen, mountedFieldComponent } from "test-utils";

import SwitchInput from "./switch-input";

describe("<Form /> - fields/<SelectInput />", () => {
  it("renders switch input", () => {
    mountedFieldComponent(<SwitchInput />);
    expect(screen.getByText("Test Field 2")).toBeInTheDocument();
  });

  it("renders help text", () => {
    mountedFieldComponent(<SwitchInput />);
    expect(screen.getByText("Test Field 2 help text")).toBeInTheDocument();
  });

  it("renders errors", () => {
    mountedFieldComponent(<SwitchInput />, {
      errors: [
        {
          name: "test_field_2",
          message: "Name is required"
        }
      ]
    });
    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });
});
