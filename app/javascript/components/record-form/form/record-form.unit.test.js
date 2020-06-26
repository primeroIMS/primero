import { fromJS, Map } from "immutable";
import { Formik } from "formik";
import { TextField as MuiTextField } from "formik-material-ui";

import { NUMERIC_FIELD } from "../constants";
import { getRecordForms } from "../selectors";
import { RECORD_TYPES } from "../../../config";
import { setupMountedComponent, stub } from "../../../test";

import FormSectionField from "./form-section-field";
import { TEXT_FIELD_NAME } from "./constants";
import RecordForm from "./record-form";

describe("<RecordForm />", () => {
  const mode = {
    isNew: false,
    isEdit: true,
    isShow: false
  };

  const initialState = Map({
    forms: Map({
      formSections: Map({
        1: {
          id: 1,
          name: {
            en: "Form Section 1"
          },
          unique_id: "form_section_1",
          module_ids: ["some_module"],
          visible: true,
          is_nested: false,
          parent_form: RECORD_TYPES.cases,
          fields: [1, 2, 3]
        }
      }),
      fields: Map({
        1: {
          id: 1,
          name: "field_1",
          display_name: {
            en: "Field 1"
          },
          type: TEXT_FIELD_NAME,
          required: true,
          visible: true
        },
        2: {
          id: 2,
          name: "field_2",
          display_name: {
            en: "Field 2"
          },
          type: TEXT_FIELD_NAME,
          visible: true
        },
        3: {
          id: 3,
          name: "field_age",
          display_name: {
            en: "Field Age"
          },
          type: NUMERIC_FIELD,
          visible: true
        }
      })
    })
  });
  const query = {
    recordType: RECORD_TYPES.cases,
    primeroModule: "some_module"
  };
  const forms = getRecordForms(initialState, query);

  let component;

  beforeEach(() => {
    const documentStub = stub(window.document, "getElementsByClassName");

    documentStub.returns([{ scrollTop: 0 }]);

    ({ component } = setupMountedComponent(RecordForm, {
      bindSubmitForm: () => {},
      forms,
      handleToggleNav: () => {},
      mobileDisplay: false,
      mode,
      onSubmit: () => {},
      record: fromJS({
        field_1: "Value 1",
        field_2: "Value 2"
      }),
      recordType: RECORD_TYPES.cases,
      selectedForm: "form_section_1"
    }));
  });

  it("renders the selected form and fields", () => {
    expect(component.find(RecordForm)).to.have.lengthOf(1);
    expect(component.find(FormSectionField)).to.have.lengthOf(3);
  });

  it("returns validation errors when the form is submitted and has an age field", async () => {
    const field1 = component
      .find(RecordForm)
      .find(Formik)
      .find(MuiTextField)
      .first();

    field1.props().form.setFieldValue("field_1", "");
    field1.props().form.setFieldValue("field_age", 140);
    field1.props().form.submitForm();

    const errors = await field1.props().form.validateForm();

    expect(errors).to.deep.equal({
      field_1: "form_section.required_field",
      field_age: "errors.models.child.age"
    });
  });

  afterEach(() => {
    window.document.getElementsByClassName?.restore();
  });
});
