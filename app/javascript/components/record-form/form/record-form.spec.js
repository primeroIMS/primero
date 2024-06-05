import { fromJS, Map } from "immutable";

import { NUMERIC_FIELD, SELECT_FIELD, TEXT_FIELD, TICK_FIELD } from "../constants";
import { getRecordForms } from "../selectors";
import { RECORD_TYPES, RECORD_TYPES_PLURAL } from "../../../config";
import { FieldRecord, FormSectionRecord } from "../records";
import { fireEvent, mountedFormComponent, screen, waitFor } from "../../../test-utils";

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
          name: { en: "Form Section 1" },
          unique_id: "form_section_1",
          module_ids: ["some_module"],
          visible: true,
          is_nested: false,
          parent_form: RECORD_TYPES.cases,
          fields: [1, 2, 3]
        }),
        2: FormSectionRecord({
          id: 2,
          name: { en: "Form Section 2" },
          unique_id: "form_section_2",
          module_ids: ["some_module"],
          visible: true,
          is_nested: false,
          parent_form: RECORD_TYPES.incidents,
          fields: [1, 2, 3, 4, 5, 6, 7, 8, 9]
        })
      }),
      fields: Map({
        1: FieldRecord({
          id: 1,
          name: "field_1",
          display_name: { en: "Field 1" },
          type: TEXT_FIELD,
          required: true,
          visible: true
        }),
        2: FieldRecord({
          id: 2,
          name: "field_2",
          display_name: { en: "Field 2" },
          type: TEXT_FIELD,
          visible: true
        }),
        3: FieldRecord({
          id: 3,
          name: "field_age",
          display_name: { en: "Field Age" },
          type: NUMERIC_FIELD,
          visible: true
        }),
        4: FieldRecord({
          id: 4,
          name: "status",
          display_name: { en: "Status" },
          type: TEXT_FIELD,
          visible: true
        }),
        5: FieldRecord({
          id: 5,
          name: "enabled",
          display_name: { en: "Enabled" },
          type: TICK_FIELD,
          visible: true
        }),
        6: FieldRecord({
          id: 6,
          name: "owned_by",
          display_name: { en: "Owned By" },
          type: TEXT_FIELD,
          visible: true
        }),
        7: FieldRecord({
          id: 7,
          name: "consent_for_services",
          display_name: { en: "Consent For Services" },
          type: TICK_FIELD,
          visible: true
        }),
        8: FieldRecord({
          id: 8,
          name: "disclosure_other_orgs",
          display_name: { en: "Disclosure Other Orgs" },
          type: TICK_FIELD,
          visible: true
        }),
        9: FieldRecord({
          id: 9,
          name: "legitimate_basis",
          display_name: { en: "Legitimate Basis" },
          type: SELECT_FIELD,
          visible: true,
          multi_select: true,
          option_strings_text: [
            { id: "contract", display_text: "Contract" },
            { id: "vital_interests", display_text: "Vital Interests" }
          ]
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
    mountedFormComponent(
      <RecordForm
        {...{
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
        }}
      />
    );

    expect(screen.getAllByTestId("text-field")).toHaveLength(3);
  });

  it("returns validation errors when the form is submitted and has an age field", async () => {
    mountedFormComponent(
      <RecordForm
        {...{
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
        }}
      />
    );

    await fireEvent.change(screen.getByRole("textbox", { name: "Field 1" }), { target: { value: "" } });
    await fireEvent.change(screen.getByRole("spinbutton", { name: "Field Age" }), { target: { value: 140 } });
    await fireEvent.submit(document.getElementsByTagName("form")[0]);

    await waitFor(() => {
      expect(screen.getByText("form_section.required_field")).toBeInTheDocument();
      expect(screen.getByText("errors.models.child.age")).toBeInTheDocument();
    });
  });

  describe("when an incidentFromCase exists", () => {
    const incidentFromCase = { status: "open", enabled: true, owned_by: "incident_owner" };

    const incidentForms = getRecordForms(initialState, {
      recordType: RECORD_TYPES.incidents,
      primeroModule: "some_module"
    });

    it("should set the values from the case if it is a new record", () => {
      mountedFormComponent(
        <RecordForm
          {...{
            bindSubmitForm: () => {},
            forms: incidentForms,
            handleToggleNav: () => {},
            mobileDisplay: false,
            mode: { isNew: true, isEdit: false, isShow: false },
            onSubmit: () => {},
            record: fromJS({}),
            recordType: RECORD_TYPES_PLURAL.incident,
            selectedForm: "form_section_2",
            incidentFromCase: fromJS(incidentFromCase),
            externalComponents: () => {},
            setFormikValuesForNav: () => {}
          }}
        />
      );

      const checkboxes = screen.getAllByRole("checkbox");

      expect(checkboxes.find(checkbox => checkbox.getAttribute("name") === "enabled")).toBeChecked();
      expect(screen.getByRole("textbox", { name: "Status" })).toHaveValue("open");
      expect(screen.getByRole("textbox", { name: "Owned By" })).toHaveValue("incident_owner");
    });

    it("should not set the values from the case if it is not a new record", () => {
      mountedFormComponent(
        <RecordForm
          {...{
            bindSubmitForm: () => {},
            forms: incidentForms,
            handleToggleNav: () => {},
            mobileDisplay: false,
            mode,
            onSubmit: () => {},
            record: fromJS({
              field_1: "Value 1",
              field_2: "Value 2",
              field_age: 10
            }),
            recordType: RECORD_TYPES_PLURAL.incident,
            selectedForm: "form_section_2",
            incidentFromCase: fromJS(incidentFromCase),
            externalComponents: () => {},
            setFormikValuesForNav: () => {}
          }}
        />
      );

      const checkboxes = screen.getAllByRole("checkbox");

      expect(checkboxes.find(checkbox => checkbox.getAttribute("name") === "enabled")).not.toBeChecked();
      expect(screen.getByRole("textbox", { name: "Status" })).not.toHaveValue("open");
      expect(screen.getByRole("textbox", { name: "Owned By" })).not.toHaveValue("incident_owner");
    });
  });

  describe("when dataProtectionInitialValues exist", () => {
    const incidentForms = getRecordForms(initialState, {
      recordType: RECORD_TYPES.incidents,
      primeroModule: "some_module"
    });

    const stateWithDataProtection = initialState.setIn(
      ["forms", "dataProtectionInitialValues"],
      fromJS({
        consent_agreements: ["consent_for_services", "disclosure_other_orgs"],
        legitimate_basis: ["contract", "vital_interests"]
      })
    );

    it("should set the dataProtectionInitialValues if the mode is New", async () => {
      mountedFormComponent(
        <RecordForm
          {...{
            bindSubmitForm: () => {},
            forms: incidentForms,
            handleToggleNav: () => {},
            mobileDisplay: false,
            mode: { isNew: true, isEdit: false, isShow: false },
            onSubmit: () => {},
            record: fromJS({}),
            recordType: RECORD_TYPES_PLURAL.incident,
            selectedForm: "form_section_2",
            externalForms: () => {},
            externalComponents: () => {},
            setFormikValuesForNav: () => {}
          }}
        />,
        { state: stateWithDataProtection }
      );

      const checkboxes = screen.getAllByRole("checkbox");

      expect(checkboxes.find(checkbox => checkbox.getAttribute("name") === "consent_for_services")).toBeChecked();
      expect(checkboxes.find(checkbox => checkbox.getAttribute("name") === "disclosure_other_orgs")).toBeChecked();
      expect(screen.getByText("Contract")).toBeInTheDocument();
      expect(screen.getByText("Vital Interests")).toBeInTheDocument();
    });

    it("should not set the dataProtectionInitialValues if the mode is Edit", () => {
      mountedFormComponent(
        <RecordForm
          {...{
            bindSubmitForm: () => {},
            forms: incidentForms,
            handleToggleNav: () => {},
            mobileDisplay: false,
            mode,
            onSubmit: () => {},
            record: fromJS({ field_1: "Value 1", field_2: "Value 2" }),
            recordType: RECORD_TYPES_PLURAL.incident,
            selectedForm: "form_section_2",
            externalForms: () => {},
            externalComponents: () => {},
            setFormikValuesForNav: () => {}
          }}
        />,
        { state: stateWithDataProtection }
      );

      const checkboxes = screen.getAllByRole("checkbox");

      expect(checkboxes.find(checkbox => checkbox.getAttribute("name") === "consent_for_services")).not.toBeChecked();
      expect(checkboxes.find(checkbox => checkbox.getAttribute("name") === "disclosure_other_orgs")).not.toBeChecked();
      expect(screen.queryByText("Contract")).toBeNull();
      expect(screen.queryByText("Vital Interests")).toBeNull();
    });
  });

  describe("when an record exists", () => {
    const initialStateRecordExists = Map({
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
            name: "name_first",
            display_name: {
              en: "First Name"
            },
            type: TEXT_FIELD,
            required: true,
            visible: true
          }),
          2: FieldRecord({
            id: 2,
            name: "name_last",
            display_name: {
              en: "Last Name"
            },
            type: TEXT_FIELD,
            visible: true
          }),
          3: FieldRecord({
            id: 3,
            name: "age",
            display_name: {
              en: "Field Age"
            },
            type: NUMERIC_FIELD,
            visible: true
          })
        })
      })
    });
    const queryRecordExists = {
      recordType: RECORD_TYPES.cases,
      primeroModule: "some_module"
    };
    const formsRecordsEdit = getRecordForms(initialStateRecordExists, queryRecordExists);

    it("should set the values for the case selected", () => {
      mountedFormComponent(
        <RecordForm
          {...{
            bindSubmitForm: () => {},
            forms: formsRecordsEdit,
            handleToggleNav: () => {},
            mobileDisplay: false,
            mode: { isNew: false, isEdit: true, isShow: false },
            onSubmit: () => {},
            record: fromJS({ age: 4, name_first: "test" }),
            recordType: RECORD_TYPES.cases,
            selectedForm: "form_section_1",
            externalForms: () => {},
            externalComponents: () => {},
            userPermittedFormsIds: fromJS({ basic_identity: "rw" }),
            setFormikValuesForNav: () => {}
          }}
        />
      );

      expect(screen.getByRole("textbox", { name: "First Name" })).toHaveValue("test");
      expect(screen.getByRole("spinbutton", { name: "Field Age" })).toHaveValue(4);
    });
  });
});
