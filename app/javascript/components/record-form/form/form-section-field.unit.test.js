import { setupMountedComponent } from "../../../test";

import FormSectionField from "./form-section-field";
import { TEXT_FIELD_NAME } from "./constants";

describe("<FormSectionField />", () => {
  const props = {
    name: "Test",
    isReadWriteForm: false,
    field: {
      type: TEXT_FIELD_NAME,
      display_name: { en: "Test" },
      disabled: false
    },
    mode: {
      isShow: true
    },
    formSection: {}
  };

  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(FormSectionField, props));
  });

  it("render a FormSectionField", () => {
    expect(component.find(FormSectionField)).lengthOf(1);
  });
});
