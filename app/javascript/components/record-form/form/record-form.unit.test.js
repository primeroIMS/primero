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
      selectedForm: "form_section_1",
      externalForms: () => {},
      externalComponents: () => {},
      userPermittedFormsIds: fromJS({ basic_identity: "rw" })
    }));
  });

  it("renders the selected form and fields", () => {
    expect(component.find(RecordForm)).to.have.lengthOf(1);
    expect(component.find(FormSectionField)).to.have.lengthOf(3);
  });

  it("returns validation errors when the form is submitted and has an age field", async () => {
    const field1 = component.find(RecordForm).find(Formik).find(MuiTextField).first();

    field1.props().form.setFieldValue("field_1", "");
    field1.props().form.setFieldValue("field_age", 140);
    field1.props().form.submitForm();

    const errors = await field1.props().form.validateForm();

    expect(errors).to.deep.equal({
      field_1: "form_section.required_field",
      field_age: "errors.models.child.age"
    });
  });

  describe("when an incidentFromCase exists", () => {
    const initialValues = {
      field_1: "",
      field_2: "",
      field_age: ""
    };

    it("should set the values from the case if it is a new record", () => {
      const incidentFromCase = { status: "open", enabled: true, owned_by: "incident_owner" };

      const { component: fromCaseComponent } = setupMountedComponent(RecordForm, {
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
        externalComponents: () => {}
      });

      expect(fromCaseComponent.find(Formik).state().values).to.deep.equal({
        ...initialValues,
        ...incidentFromCase
      });
    });

    it("should not set the values from the case if it is not a new record", () => {
      const incidentFromCase = { status: "open", enabled: true, owned_by: "incident_owner" };
      const recordData = { field_1: "Value 1", field_2: "Value 2", field_age: "10" };

      const { component: fromCaseComponent } = setupMountedComponent(RecordForm, {
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
        externalComponents: () => {}
      });

      expect(fromCaseComponent.find(Formik).state().values).to.deep.equal(recordData);
    });

    it("should not set the values from the case if the recordType is not incidents", () => {
      const incidentFromCase = { status: "open", enabled: true, owned_by: "incident_owner" };

      const { component: fromCaseComponent } = setupMountedComponent(RecordForm, {
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
        externalComponents: () => {}
      });

      expect(fromCaseComponent.find(Formik).state().values).to.deep.equal(initialValues);
    });
  });

  it("should set the values from the case if it is a new record", () => {
    const initialValues = {
      field_1: "",
      field_2: "",
      field_age: ""
    };

    const { component: fromCaseComponent } = setupMountedComponent(RecordForm, {
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
      externalComponents: () => {}
    });

    expect(fromCaseComponent.find(Formik).state().values).to.deep.equal({
      ...initialValues,
      ...{ name: "test" }
    });
  });

  describe("when dataProtectionInitialValues exist", () => {
    const initialValues = {
      field_1: "",
      field_2: "",
      field_age: ""
    };

    it("should set the dataProtectionInitialValues if the mode is New", () => {
      const currentState = fromJS({
        forms: {
          dataProtectionInitialValues: {
            consent_agreements: ["consent_for_services", "disclosure_other_orgs"],
            legitimate_basis: ["contract", "vital_interests"]
          }
        }
      });
      const { component: fromCaseComponent } = setupMountedComponent(
        RecordForm,
        {
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
          externalComponents: () => {}
        },
        currentState
      );

      expect(fromCaseComponent.find(Formik).state().values).to.deep.equal({
        ...initialValues,
        consent_for_services: true,
        disclosure_other_orgs: true,
        legitimate_basis: ["contract", "vital_interests"]
      });
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

      const { component: fromCaseComponent } = setupMountedComponent(
        RecordForm,
        {
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
          externalComponents: () => {}
        },
        currentState
      );

      expect(fromCaseComponent.find(Formik).state().values).to.deep.equal({
        field_1: "Value 1",
        field_2: "Value 2",
        field_age: "10"
      });
    });
  });

  it("renders component with valid props", () => {
    const incidentsProps = { ...component.find(RecordForm).props() };

    [
      "bindSubmitForm",
      "forms",
      "handleToggleNav",
      "mobileDisplay",
      "mode",
      "onSubmit",
      "record",
      "recordType",
      "externalForms",
      "selectedForm",
      "userPermittedFormsIds",
      "externalComponents"
    ].forEach(property => {
      expect(incidentsProps).to.have.property(property);
      delete incidentsProps[property];
    });
    expect(incidentsProps).to.be.empty;
  });

  afterEach(() => {
    window.document.getElementsByClassName?.restore();
  });
});
