import { fromJS, Map } from "immutable";
import { NUMERIC_FIELD } from "../constants";
import { getRecordForms } from "../selectors";
import { RECORD_TYPES } from "../../../config";
import { FieldRecord, FormSectionRecord } from "../records";
import { TEXT_FIELD_NAME } from "./constants";
import RecordForm from "./record-form";
import { mountedFormComponent, screen } from "../../../test-utils";

describe("<RecordForm />", () => {
  const mode = {
    isNew: false,
    isEdit: true,
    isShow: false
  };

  const initialState = Map({
    forms: Map({
      formSections: Map({
        1: FormSectionRecord({
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
        })
      }),
      fields: Map({
        1: FieldRecord({
          id: 1,
          name: "field_1",
          display_name: {
            en: "Field 1"
          },
          type: TEXT_FIELD_NAME,
          required: true,
          visible: true
        }),
        2: FieldRecord({
          id: 2,
          name: "field_2",
          display_name: {
            en: "Field 2"
          },
          type: TEXT_FIELD_NAME,
          visible: true
        }),
        3: FieldRecord({
          id: 3,
          name: "field_age",
          display_name: {
            en: "Field Age"
          },
          type: NUMERIC_FIELD,
          visible: true
        })
      })
    })
  });
  const query = {
    recordType: RECORD_TYPES.cases,
    primeroModule: "some_module"
  };
  const forms = getRecordForms(initialState, query);

  it("renders the selected form and fields", () => {
    mountedFormComponent(<RecordForm {...{
      bindSubmitForm: () => { },
      forms,
      handleToggleNav: () => { },
      mobileDisplay: false,
      mode,
      onSubmit: () => { },
      record: fromJS({
        field_1: "Value 1",
        field_2: "Value 2"
      }),
      recordType: RECORD_TYPES.cases,
      selectedForm: "form_section_1",
      externalForms: () => { },
      externalComponents: () => { },
      userPermittedFormsIds: fromJS({ basic_identity: "rw" }),
      setFormikValuesForNav: () => { }
    }} />);

    expect(screen.getAllByRole('textbox')).toHaveLength(2);

  });

  it("returns validation errors when the form is submitted and has an age field", async () => {
    mountedFormComponent(<RecordForm {...{
      bindSubmitForm: () => { },
      forms,
      handleToggleNav: () => { },
      mobileDisplay: false,
      mode,
      onSubmit: () => { },
      record: fromJS({
        field_1: "Value 1",
        field_2: "Value 2"
      }),
      recordType: RECORD_TYPES.cases,
      selectedForm: "form_section_1",
      externalForms: () => { },
      externalComponents: () => { },
      userPermittedFormsIds: fromJS({ basic_identity: "rw" }),
      setFormikValuesForNav: () => { }
    }} />);

    expect(screen.getAllByRole('textbox')).toHaveLength(2);
  });

  describe("when an incidentFromCase exists", () => {

    it("should set the values from the case if it is a new record", () => {
      mountedFormComponent(<RecordForm {...{
        bindSubmitForm: () => { },
        forms,
        handleToggleNav: () => { },
        mobileDisplay: false,
        mode,
        onSubmit: () => { },
        record: fromJS({
          field_1: "Value 1",
          field_2: "Value 2"
        }),
        recordType: RECORD_TYPES.cases,
        selectedForm: "form_section_1",
        externalForms: () => { },
        externalComponents: () => { },
        userPermittedFormsIds: fromJS({ basic_identity: "rw" }),
        setFormikValuesForNav: () => { }
      }} />);

      expect(screen.getAllByRole('textbox')).toHaveLength(2);
    });

    it("should not set the values from the case if it is not a new record", () => {
      mountedFormComponent(<RecordForm {...{
        bindSubmitForm: () => { },
        forms,
        handleToggleNav: () => { },
        mobileDisplay: false,
        mode,
        onSubmit: () => { },
        record: fromJS({
          field_1: "Value 1",
          field_2: "Value 2"
        }),
        recordType: RECORD_TYPES.cases,
        selectedForm: "form_section_1",
        externalForms: () => { },
        externalComponents: () => { },
        userPermittedFormsIds: fromJS({ basic_identity: "rw" }),
        setFormikValuesForNav: () => { }
      }} />);

      expect(screen.getAllByRole('textbox')).toHaveLength(2);
    });
  });

  describe("when dataProtectionInitialValues exist", () => {
   
    it("should set the dataProtectionInitialValues if the mode is New", () => {
      mountedFormComponent(<RecordForm {...{
        bindSubmitForm: () => { },
        forms,
        handleToggleNav: () => { },
        mobileDisplay: false,
        mode,
        onSubmit: () => { },
        record: fromJS({
          field_1: "Value 1",
          field_2: "Value 2"
        }),
        recordType: RECORD_TYPES.cases,
        selectedForm: "form_section_1",
        externalForms: () => { },
        externalComponents: () => { },
        userPermittedFormsIds: fromJS({ basic_identity: "rw" }),
        setFormikValuesForNav: () => { }
      }} />);

      expect(screen.getAllByRole('textbox')).toHaveLength(2);
    });

    it("should not set the dataProtectionInitialValues if the mode is Edit", () => {
      mountedFormComponent(<RecordForm {...{
        bindSubmitForm: () => { },
        forms,
        handleToggleNav: () => { },
        mobileDisplay: false,
        mode,
        onSubmit: () => { },
        record: fromJS({
          field_1: "Value 1",
          field_2: "Value 2"
        }),
        recordType: RECORD_TYPES.cases,
        selectedForm: "form_section_1",
        externalForms: () => { },
        externalComponents: () => { },
        userPermittedFormsIds: fromJS({ basic_identity: "rw" }),
        setFormikValuesForNav: () => { }
      }} />);

      expect(screen.getAllByRole('textbox')).toHaveLength(2);
    });
  });
});
