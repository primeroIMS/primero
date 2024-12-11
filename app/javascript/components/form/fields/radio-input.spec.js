import { screen, mountedFieldComponent } from "test-utils";

import RadioInput from "./radio-input";

describe("<Form /> - fields/<RadioInput />", () => {
  const props = {
    commonInputProps: {
      label: "Test Field 2",
      name: "test"
    },
    options: [
      { id: 1, display_text: "option-1" },
      { id: 2, display_text: "option-2" }
    ],
    formMethods: {}
  };

  it("renders RadioInput inputs", () => {
    mountedFieldComponent(<RadioInput {...props} />);
    expect(screen.getByText("option-1")).toBeInTheDocument();
    expect(screen.getByText("option-2")).toBeInTheDocument();
  });

  it("renders help text", () => {
    mountedFieldComponent(<RadioInput {...props} />);
    expect(screen.getByText("Test Field 2 help text")).toBeInTheDocument();
  });

  it("renders label", () => {
    mountedFieldComponent(<RadioInput {...props} />);
    expect(screen.getByText("Test Field 2")).toBeInTheDocument();
  });
});
