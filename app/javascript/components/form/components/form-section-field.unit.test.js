import Alert from "@material-ui/lab/Alert";
import { fromJS } from "immutable";

import { setupMockFormComponent } from "../../../test";
import { FieldRecord } from "../records";
import { RADIO_FIELD, TOGGLE_FIELD, DIALOG_TRIGGER, DOCUMENT_FIELD } from "../constants";

import FormSectionField from "./form-section-field";

describe("<Form /> - components/<FormSectionField />", () => {
  it("renders a text field", () => {
    const field = FieldRecord({ name: "test_field", type: "text_field" });
    const { component } = setupMockFormComponent(FormSectionField, { props: { field } });

    expect(component.exists("input[name='test_field']")).to.be.true;
  });

  it("renders a textarea field", () => {
    const field = FieldRecord({ name: "test_field", type: "textarea" });
    const { component } = setupMockFormComponent(FormSectionField, { props: { field } });

    expect(component.exists("textarea[name='test_field']")).to.be.true;
  });

  it("renders an error field", () => {
    const field = FieldRecord({ name: "test_field", type: "error_field" });
    const { component } = setupMockFormComponent(
      ({ formMethods }) => {
        return (
          <FormSectionField
            field={field}
            checkErrors={fromJS(["name"])}
            formMode={fromJS({})}
            formMethods={formMethods}
          />
        );
      },
      {
        errors: [
          {
            name: "name",
            message: "test"
          }
        ]
      }
    );

    expect(component.find(Alert)).to.have.lengthOf(1);
  });

  it("does not render an error field", () => {
    const field = FieldRecord({ name: "test_field", type: "error_field" });
    const { component } = setupMockFormComponent(({ formMethods }) => (
      <FormSectionField field={field} checkErrors={fromJS(["name"])} formMode={fromJS({})} formMethods={formMethods} />
    ));

    expect(component.find(Alert)).to.be.empty;
  });

  it("renders a radio button field", () => {
    const field = FieldRecord({
      name: "radio_test_field",
      type: RADIO_FIELD,
      option_strings_text: {
        en: [
          {
            id: "yes",
            label: "Yes"
          },
          {
            id: "no",
            label: "No"
          }
        ]
      }
    });
    const { component } = setupMockFormComponent(FormSectionField, { props: { field } });

    expect(component.exists("input[name='radio_test_field']")).to.be.true;
  });

  it("renders a toggle field", () => {
    const field = FieldRecord({ name: "test_field", type: TOGGLE_FIELD });
    const { component } = setupMockFormComponent(FormSectionField, { props: { field } });

    expect(component.exists("input[name='test_field']")).to.be.true;
  });

  it("renders a buttons link", () => {
    const field = FieldRecord({ name: "test_field", type: DIALOG_TRIGGER, display_name: { en: "Test Field" } });
    const { component } = setupMockFormComponent(FormSectionField, { props: { field } });
    const buttonLink = component.find("a");

    expect(buttonLink).to.have.lengthOf(1);
    expect(buttonLink.text()).to.be.equal("Test Field");
  });

  it("renders an attachement field", () => {
    const field = FieldRecord({ name: "test_document_field", type: DOCUMENT_FIELD });
    const { component } = setupMockFormComponent(FormSectionField, { props: { field } });
    const inputSelector = "input[name='test_document_field']";

    expect(component.find(inputSelector)).to.have.lengthOf(1);
    expect(component.find(inputSelector).props().type).to.be.equal("file");
  });
});
