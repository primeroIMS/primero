import { screen, setupMockFormComponent } from "test-utils";
import { fromJS } from "immutable";

import { FieldRecord } from "../records";
import { RADIO_FIELD, DIALOG_TRIGGER, DOCUMENT_FIELD } from "../constants";

import FormSectionField from "./form-section-field";

describe("<Form /> - components/<FormSectionField />", () => {
  it("renders a text field", () => {
    const field = FieldRecord({ name: "test_field", type: "text_field" });

    setupMockFormComponent(FormSectionField, { props: { field } });
    expect(document.querySelector("#test_field")).toBeInTheDocument();
  });

  it("renders an error field", () => {
    const field = FieldRecord({ name: "test_field", type: "error_field" });

    setupMockFormComponent(
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
            message: "test-error"
          }
        ]
      }
    );
    expect(screen.getByText("test-error")).toBeInTheDocument();
  });

  it("renders a radio button field", () => {
    const field = FieldRecord({
      name: "radio_test_field",
      id: "radio_test_field",
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

    setupMockFormComponent(FormSectionField, { props: { field } });
    expect(document.querySelector("#radio_test_field")).toBeInTheDocument();
  });

  it("renders a buttons link", () => {
    const field = FieldRecord({ name: "test_field", type: DIALOG_TRIGGER, display_name: { en: "Test Field" } });

    setupMockFormComponent(FormSectionField, { props: { field } });
    expect(screen.getByText("Test Field")).toBeInTheDocument();
  });

  it("renders an attachement field", () => {
    const field = FieldRecord({ name: "test_document_field", type: DOCUMENT_FIELD });

    setupMockFormComponent(FormSectionField, { props: { field } });
    expect(document.querySelector("#test_document_field")).toBeInTheDocument();
  });
});
