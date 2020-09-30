import { Button } from "@material-ui/core";

import { FieldRecord } from "../records";
import { setupMockFieldComponent } from "../../../test";

import ButtonsLink from "./button-link";

describe("form/fields/button-link.jsx", () => {
  const props = {
    commonInputProps: {
      label: "Test label"
    },
    metaInputProps: {
      onClick: () => {}
    }
  };

  it("renders button component", () => {
    const { component } = setupMockFieldComponent(ButtonsLink, FieldRecord, {}, props);

    expect(component.find(Button)).to.have.lengthOf(1);
  });

  it("renders button component with text", () => {
    const { component } = setupMockFieldComponent(ButtonsLink, FieldRecord, {}, props);

    expect(component.find(Button).text()).to.eql("Test label");
  });
});
