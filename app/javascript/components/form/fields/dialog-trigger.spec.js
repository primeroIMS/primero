import { screen, mountedFieldComponent } from "test-utils";

import DialogTrigger from "./dialog-trigger";

describe("form/fields/dialog-trigger.jsx", () => {
  const inputProps = {
    commonInputProps: {
      label: "Test label"
    },
    metaInputProps: {
      onClick: () => {}
    }
  };

  it("renders button component with text", () => {
    mountedFieldComponent(<DialogTrigger />, { inputProps });
    expect(screen.getByText("Test label")).toBeInTheDocument();
  });
});
