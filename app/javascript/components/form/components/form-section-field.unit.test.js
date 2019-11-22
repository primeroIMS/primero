import { expect, setupMockFormComponent } from "../../../test";

import FormSectionField from "./form-section-field";
import { FieldRecord } from "../records";

describe("<Form /> - components/<FormSectionField />", () => {
  it("renders a text field", () => {
    const field = FieldRecord({ name: "test_field", type: "text_field" });
    const { component } = setupMockFormComponent(FormSectionField, { field });

    expect(component.exists("input[name='test_field']")).to.be.true;
  });

  it("renders a textarea field", () => {
    const field = FieldRecord({ name: "test_field", type: "textarea" });
    const { component } = setupMockFormComponent(FormSectionField, { field });

    expect(component.exists("textarea[name='test_field']")).to.be.true;
  });
});
