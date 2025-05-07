import { screen, mountedComponent } from "test-utils";
import { fromJS } from "immutable";
import { object, string } from "yup";

import Form from "./component";
import { FORM_MODE_DIALOG } from "./constants";
import { FormSectionRecord, FieldRecord } from "./records";

describe("<Form>", () => {
  const formSubmit = jest.fn();
  const FORM_ID = "test-form";

  const formSections = fromJS([
    FormSectionRecord({
      unique_id: "notes_section",
      fields: [
        FieldRecord({
          display_name: "Test Field 1",
          name: "test_field_1",
          type: "text_field"
        }),
        FieldRecord({
          display_name: "Test Field 2",
          name: "test_field_2",
          type: "textarea"
        })
      ]
    })
  ]);

  const props = {
    formSections,
    mode: FORM_MODE_DIALOG,
    onSubmit: formSubmit,
    validations: object().shape({
      test_field_1: string().required()
    }),
    formID: FORM_ID
  };

  it("renders form based on formSection props", () => {
    mountedComponent(<Form {...props} />);
    expect(screen.getAllByText("Test Field 1")).toBeTruthy();
    expect(screen.getAllByText("Test Field 2")).toBeTruthy();
  });

  it.todo("should set form with initial values");

  it.todo("should not submit form when invalid");
});
