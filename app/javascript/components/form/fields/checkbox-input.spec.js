import { screen, mountedFieldComponent } from "test-utils";

import CheckboxInput from "./checkbox-input";

describe("<Form /> - fields/<SelectInput />", () => {
  const props = {
    commonInputProps: {
      label: "Test label",
      name: "test"
    },
    options: [
      { id: 1, display_text: "option-1" },
      { id: 2, display_text: "option-2" }
    ]
  };

  it("renders checkbox inputs", () => {
    mountedFieldComponent(<CheckboxInput {...props} />);
    expect(screen.getByText("option-1")).toBeInTheDocument();
    expect(screen.getByText("option-2")).toBeInTheDocument();
  });

  it("renders help text", () => {
    mountedFieldComponent(<CheckboxInput {...props} />);
    expect(screen.getByText("Test Field 2 help text")).toBeInTheDocument();
  });

  it("renders errors", () => {
    mountedFieldComponent(<CheckboxInput {...props} />, {
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
    mountedFieldComponent(<CheckboxInput {...props} />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });
});
