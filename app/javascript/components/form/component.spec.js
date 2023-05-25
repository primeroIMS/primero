import { screen, mountedComponent, spy,userEvent } from "test-utils";
import { fromJS } from "immutable";
import * as yup from "yup";
import Form from "./component";
import { FORM_MODE_DIALOG } from "./constants";
import { FormSectionRecord, FieldRecord } from "./records";
import { FormSection } from ".";
describe("<Form>", () => {
    const formSubmit = spy();
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
      validations: yup.object().shape({
        test_field_1: yup.string().required()
      }),
      formID: FORM_ID
    };

    it("renders form based on formSection props", () => {
        mountedComponent(<Form {...props} />);
        expect(screen.getAllByText("Test Field 1")).toBeTruthy();
        expect(screen.getAllByText("Test Field 2")).toBeTruthy();
    });

    // it("should set form with initial values", () => {
    //     const initialValues = { test_field_2: "Hello" }
    //     mountedComponent(<Form {...initialValues} />);
    //     expect(screen.getByText("Hello")).toBeInTheDocument();
    // });   
});