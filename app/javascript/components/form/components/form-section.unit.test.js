import { fromJS } from "immutable";

import { expect, setupMockFormComponent } from "../../../test";
import { FieldRecord, FormSectionRecord } from "../records";

import FormSection from "./form-section";
import FormSectionField from "./form-section-field";

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

  it("renders a form section with checkErrors prop", () => {
    const checkErrors = fromJS(["name"]);
    const formSection = FormSectionRecord({
      unique_id: "form_section",
      name: "Form Section",
      check_errors: checkErrors,
      fields: [
        FieldRecord({
          display_name: "Name",
          name: "name",
          type: "name"
        })
      ]
    });
    const { component } = setupMockFormComponent(FormSection, { formSection });

    expect(component.find(FormSectionField).props().checkErrors).to.deep.equal(
      checkErrors
    );
  });
});
