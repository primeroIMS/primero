import { expect, setupMockFormComponent } from "../../../test";

import FormSection from "./form-section";
import { FieldRecord, FormSectionRecord } from "../records";

describe("<Form /> - components/<FormSection />", () => {
  it("renders a form section with title and fields", () => {
    const formSection = FormSectionRecord({
      unique_id: "form_section",
      name: "Form Section",
      fields: [
        FieldRecord({
          display_name: "Test Field",
          name: "test_field",
          type: "text_field"
        })
      ]
    });
    const { component } = setupMockFormComponent(FormSection, { formSection });

    expect(component.exists("input[name='test_field']")).to.be.true;
    expect(component.find("h1")).to.have.lengthOf(1);
    expect(component.find("h1").text()).to.equal("Form Section");
  });
});
