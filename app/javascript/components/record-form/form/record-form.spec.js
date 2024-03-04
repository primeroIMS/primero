import { fromJS, Map } from "immutable";

import { NUMERIC_FIELD } from "../constants";
import { getRecordForms } from "../selectors";
import { RECORD_TYPES } from "../../../config";
import { mountedComponent, stub, screen } from "../../../test-utils";
import { FieldRecord, FormSectionRecord } from "../records";

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

  const documentStub = stub(window.document, "getElementsByClassName");

  documentStub.returns([{ scrollTop: 0 }]);

  const props = {
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
    selectedForm: "form_section_1",
    externalForms: () => {},
    externalComponents: () => {},
    userPermittedFormsIds: fromJS({ basic_identity: "rw" }),
    setFormikValuesForNav: () => {}
  };

  it("renders the selected form and fields", () => {
    mountedComponent(<RecordForm {...props} />);
    expect(screen.getAllByTestId("form-section-field")).toHaveLength(3);
  });

  it("returns validation errors when the form is submitted and has an age field", async () => {
    mountedComponent(<RecordForm {...props} />);
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
  });

  describe("when an incidentFromCase exists", () => {

    it("should set the values from the case if it is a new record", () => {
      const incidentFromCase = { status: "open", enabled: true, owned_by: "incident_owner" };

      const caseProps = {
        bindSubmitForm: () => {},
        forms,
        handleToggleNav: () => {},
        mobileDisplay: false,
        mode: { isNew: true, isEdit: false, isShow: false },
        onSubmit: () => {},
        record: fromJS({}),
        recordType: "incidents",
        selectedForm: "form_section_1",
        incidentFromCase: fromJS(incidentFromCase),
        externalComponents: () => {},
        setFormikValuesForNav: () => {}
      };

      mountedComponent(<RecordForm {...caseProps} />);
      expect(screen.getAllByTestId("form-section-field")).toHaveLength(3);
    });

    it("should not set the values from the case if it is not a new record", () => {
      const incidentFromCase = { status: "open", enabled: true, owned_by: "incident_owner" };
      const recordData = { field_1: "Value 1", field_2: "Value 2", field_age: "10" };

      const notNewRecordProps = {
        bindSubmitForm: () => {},
        forms,
        handleToggleNav: () => {},
        mobileDisplay: false,
        mode,
        onSubmit: () => {},
        record: fromJS(recordData),
        recordType: "incidents",
        selectedForm: "form_section_1",
        incidentFromCase: fromJS(incidentFromCase),
        externalComponents: () => {},
        setFormikValuesForNav: () => {}
      };

      mountedComponent(<RecordForm {...notNewRecordProps} />);
      expect(screen.getAllByTestId("form-section-field")).toHaveLength(3);
    });

    it("should not set the values from the case if the recordType is not incidents", () => {
      const incidentFromCase = { status: "open", enabled: true, owned_by: "incident_owner" };

      const incidentsProps = {
        bindSubmitForm: () => {},
        forms,
        handleToggleNav: () => {},
        mobileDisplay: false,
        mode: { isNew: true, isEdit: false, isShow: false },
        onSubmit: () => {},
        record: fromJS({}),
        recordType: "cases",
        selectedForm: "form_section_1",
        incidentFromCase: fromJS(incidentFromCase),
        externalComponents: () => {},
        setFormikValuesForNav: () => {}
      };

      mountedComponent(<RecordForm {...incidentsProps} />);
      expect(screen.getAllByRole("textbox")).toHaveLength(2);
    });
  });

  it("should set the values from the case if it is a new record", () => {

    const newRecordProps = {
      bindSubmitForm: () => {},
      forms,
      handleToggleNav: () => {},
      mobileDisplay: false,
      mode: { isNew: true, isEdit: false, isShow: false },
      onSubmit: () => {},
      record: fromJS({ name: "test" }),
      recordType: "cases",
      selectedForm: "form_section_1",
      incidentFromCase: {},
      externalComponents: () => {},
      setFormikValuesForNav: () => {}
    };

    mountedComponent(<RecordForm {...newRecordProps} />);
    expect(screen.getAllByTestId("form-section-field")).toHaveLength(3);
  });

  describe("when dataProtectionInitialValues exist", () => {

    it("should set the dataProtectionInitialValues if the mode is New", () => {
      const currentState = fromJS({
        forms: {
          dataProtectionInitialValues: {
            consent_agreements: ["consent_for_services", "disclosure_other_orgs"],
            legitimate_basis: ["contract", "vital_interests"]
          }
        }
      });
      const modeIsNewProps = {
        bindSubmitForm: () => {},
        forms,
        handleToggleNav: () => {},
        mobileDisplay: false,
        mode: { isNew: true, isEdit: false, isShow: false },
        onSubmit: () => {},
        record: fromJS({}),
        recordType: "cases",
        selectedForm: "form_section_1",
        incidentFromCase: {},
        externalComponents: () => {},
        setFormikValuesForNav: () => {}
      };

      mountedComponent(<RecordForm {...modeIsNewProps} />, currentState);
      expect(screen.getAllByRole("textbox")).toHaveLength(2);
    });

    it("should not set the dataProtectionInitialValues if the mode is Edit", () => {
      const currentState = fromJS({
        forms: {
          dataProtectionInitialValues: {
            consent_agreements: ["consent_for_services", "disclosure_other_orgs"],
            legitimate_basis: ["contract", "vital_interests"]
          }
        }
      });

      const recordData = { field_1: "Value 1", field_2: "Value 2", field_age: "10" };
      const modeIsEditProps = {
        bindSubmitForm: () => {},
        forms,
        handleToggleNav: () => {},
        mobileDisplay: false,
        mode: { isNew: false, isEdit: true, isShow: false },
        onSubmit: () => {},
        record: fromJS(recordData),
        recordType: "cases",
        selectedForm: "form_section_1",
        incidentFromCase: {},
        externalComponents: () => {},
        setFormikValuesForNav: () => {}
      };

      mountedComponent(<RecordForm {...modeIsEditProps} />, currentState);
      expect(screen.getAllByRole("textbox")).toHaveLength(2);
    });
  });
});
