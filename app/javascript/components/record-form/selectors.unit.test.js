import { Map, List, OrderedMap, fromJS } from "immutable";
import { expect } from "chai";

import { mapEntriesToRecord } from "../../libs";
import { ACTIONS } from "../../libs/permissions";
import {
  APPROVALS,
  CHANGE_LOGS,
  INCIDENT_FROM_CASE,
  RECORD_INFORMATION_GROUP,
  RECORD_OWNER,
  REFERRAL,
  TRANSFERS_ASSIGNMENTS
} from "../../config";
import { FieldRecord } from "../form";

import * as R from "./records";
import * as selectors from "./selectors";

const formSections = {
  62: {
    id: 62,
    unique_id: "basic_identity",
    name: {
      en: "Basic Identity",
      fr: "",
      ar: "",
      "ar-LB": "",
      so: "",
      es: ""
    },
    visible: true,
    is_first_tab: true,
    order: 10,
    order_form_group: 30,
    parent_form: "case",
    editable: true,
    module_ids: ["primeromodule-cp"],
    form_group_id: "identification_registration",
    form_group_name: {
      en: "Identification / Registration",
      fr: "",
      ar: "",
      "ar-LB": "",
      so: "",
      es: ""
    },
    fields: [1],
    is_nested: null
  },
  63: {
    id: 63,
    unique_id: "documents_form",
    name: {
      en: "Documents Form",
      fr: "",
      ar: "",
      "ar-LB": "",
      so: "",
      es: ""
    },
    visible: true,
    is_first_tab: true,
    order: 10,
    order_form_group: 30,
    parent_form: "case",
    editable: true,
    module_ids: ["primeromodule-cp"],
    form_group_id: "documents_group",
    form_group_name: {
      en: "Documents Group",
      fr: "",
      ar: "",
      "ar-LB": "",
      so: "",
      es: ""
    },
    fields: [2],
    is_nested: null
  }
};

const invisibleFormSection = {
  62: {
    id: 62,
    unique_id: "invisible_form",
    name: {
      en: "Invisible Form",
      fr: "",
      ar: "",
      "ar-LB": "",
      so: "",
      es: ""
    },
    visible: false,
    is_first_tab: true,
    order: 10,
    order_form_group: 30,
    parent_form: "case",
    editable: true,
    module_ids: ["primeromodule-cp"],
    form_group_id: "invisible",
    form_group_name: {
      en: "Invisible",
      fr: "",
      ar: "",
      "ar-LB": "",
      so: "",
      es: ""
    },
    fields: [1],
    is_nested: null
  }
};

const fields = {
  1: {
    name: "name_first",
    type: "text_field",
    editable: true,
    disabled: null,
    visible: true,
    display_name: {
      en: "First Name",
      fr: "",
      ar: "",
      "ar-LB": "",
      so: "",
      es: ""
    },
    subform_section_id: null,
    help_text: {},
    multi_select: null,
    option_strings_source: null,
    option_strings_text: null,
    guiding_questions: "",
    required: true,
    date_validation: "default_date_validation",
    href: null,
    show_on_minify_form: true
  },
  2: {
    name: "document_field",
    type: "document_upload_box",
    editable: true,
    disabled: null,
    visible: true,
    display_name: {
      en: "Document",
      fr: "",
      ar: "",
      "ar-LB": "",
      so: "",
      es: ""
    },
    subform_section_id: null,
    help_text: {},
    multi_select: null,
    option_strings_source: null,
    option_strings_text: null,
    guiding_questions: "",
    required: true,
    date_validation: "default_date_validation",
    href: null
  }
};
const serviceTypeLookup = {
  id: 1,
  unique_id: "lookup-location-type",
  values: [
    { id: "country", display_text: { en: "Country" } },
    { id: "region", display_text: { en: "Region" } }
  ]
};
const location = {
  id: 1,
  code: "001",
  type: "country",
  name: {
    en: "Test",
    es: "Prueba",
    fr: ""
  }
};

const serviceToRefer = {
  service_type: "some_service",
  service_implementing_agency: "some_agency",
  service_implementing_agency_individual: "some_user"
};

const validationErrors = [
  {
    unique_id: "form_1",
    form_group_id: "group_1",
    errors: {
      field_1: "field_1 is required"
    }
  }
];

const stateWithNoRecords = Map({});
const stateWithRecords = fromJS({
  ui: {
    I18n: {
      locale: "en",
      dir: "ltr"
    }
  },
  forms: {
    attachmentMeta: {
      forms: { documents_form: { en: "Documents Form" } }
    },
    selectedForm: "basic_identity",
    recordAlerts: [
      {
        alert_for: "field_change",
        type: "notes",
        date: "2020-04-02",
        form_unique_id: "notes"
      }
    ],
    serviceToRefer,
    formSections: mapEntriesToRecord(formSections, R.FormSectionRecord),
    fields: mapEntriesToRecord(fields, R.FieldRecord),
    loading: true,
    errors: true,
    options: {
      lookups: [serviceTypeLookup],
      locations: [location]
    },
    selectedRecord: {
      age: 26,
      case_id: "caf0cf17-901b-4b01-80d5-5ceb72063a4b",
      case_id_display: "2063a4b",
      created_at: "2019-08-06T20:21:19.864Z",
      created_by: "primero",
      date_of_birth: "1993-06-05",
      id: "e15acbe5-9501-4615-9f43-cb6873997fc1",
      module_id: "primeromodule-cp",
      name: "Gerald Padgett",
      name_first: "Gerald",
      name_given_post_separation: true,
      name_last: "Padgett",
      owned_by: "primero",
      owned_by_agency_id: 1,
      previously_owned_by: "primero",
      record_state: true,
      registration_date: "2019-08-06",
      sex: "male",
      short_id: "2063a4b"
    },
    validationErrors
  }
});

const stateWithInvisibleForms = stateWithRecords.setIn(
  ["forms", "formSections"],
  fromJS(mapEntriesToRecord(invisibleFormSection, R.FormSectionRecord))
);

describe("<RecordForm /> - Selectors", () => {
  describe("getErrors", () => {
    it("should return error value", () => {
      const errors = selectors.getErrors(stateWithRecords);

      expect(errors).to.deep.equal(true);
    });

    it("should return false when there is not any error", () => {
      const errors = selectors.getErrors(stateWithNoRecords);

      expect(errors).to.deep.equal(false);
    });
  });

  describe("getLoadingState", () => {
    it("should return loading state value", () => {
      const loadingState = selectors.getLoadingState(stateWithRecords);

      expect(loadingState).to.deep.equal(true);
    });

    it("should return false when there is not any loading state", () => {
      const loadingState = selectors.getLoadingState(stateWithNoRecords);

      expect(loadingState).to.deep.equal(false);
    });
  });

  describe("getRecord", () => {
    it("should not find removed function getRecord", () => {
      expect(selectors.getRecord).to.be.an("undefined");
    });
  });

  describe("getOption", () => {
    it("should return the options or lookups", () => {
      const expected = [
        { id: "country", display_text: "Country", disabled: false },
        { id: "region", display_text: "Region", disabled: false }
      ];

      const record = selectors.getOption(stateWithRecords, "lookup lookup-location-type", "en");

      expect(Object.keys(record)).to.deep.equal(Object.keys(expected));
      expect(Object.values(record)).to.deep.equal(Object.values(expected));
      expect(record).to.deep.equal(expected);
    });

    it("should return an empty array when there are not any options", () => {
      const record = selectors.getOption(stateWithNoRecords);

      expect(record).to.be.empty;
    });

    it("should return the options for optionStringsText", () => {
      const optionStringsText = [
        { id: "submitted", display_text: { en: "Submitted", fr: "", ar: "" } },
        { id: "pending", disabled: true, display_text: { en: "Pending", fr: "", ar: "" } },
        { id: "no", display_text: { en: "No", fr: "", ar: "" } }
      ];
      const expected = [
        { id: "submitted", display_text: "Submitted", disabled: false },
        { id: "no", display_text: "No", disabled: false }
      ];
      const result = selectors.getOption(stateWithRecords, optionStringsText, "en");

      expect(result).to.deep.equal(expected);
    });

    it("should return the options including the disabled and selected for optionStringsText", () => {
      const optionStringsText = [
        { id: "submitted", display_text: { en: "Submitted", fr: "", ar: "" } },
        { id: "pending", disabled: true, display_text: { en: "Pending", fr: "", ar: "" } },
        { id: "no", display_text: { en: "No", fr: "", ar: "" } },
        { id: "other", disabled: true, display_text: { en: "Other", fr: "", ar: "" } }
      ];
      const expected = [
        { id: "submitted", display_text: "Submitted", disabled: false },
        { id: "pending", display_text: "Pending", disabled: true },
        { id: "no", display_text: "No", disabled: false }
      ];
      const result = selectors.getOption(stateWithRecords, optionStringsText, "en", "pending");

      expect(result).to.deep.equal(expected);
    });

    it("should return the options even if stored value it's a boolean", () => {
      const optionStringsText = [
        { id: "true", display_text: { en: "Yes" }, disabled: false },
        { id: "false", display_text: { en: "No" }, disabled: false }
      ];
      const expected = optionStringsText.map(option => ({ ...option, display_text: option.display_text.en }));
      const result = selectors.getOption(stateWithRecords, optionStringsText, "en", true);

      expect(result).to.deep.equal(expected);
    });
  });

  describe("getAttachmentForms", () => {
    it("should return the forms with attachments", () => {
      const attachmentForms = selectors.getAttachmentForms(stateWithRecords, "en");
      const expected = fromJS({ documents_form: { en: "Documents Form" } });

      expect(attachmentForms).to.deep.equal(expected);
    });
  });

  describe("getRecordForms", () => {
    it("should return the record forms", () => {
      const expected = List([
        R.FormSectionRecord({
          id: 62,
          unique_id: "basic_identity",
          name: Map({
            en: "Basic Identity",
            fr: "",
            ar: "",
            "ar-LB": "",
            so: "",
            es: ""
          }),
          visible: true,
          is_first_tab: true,
          order: 10,
          order_form_group: 30,
          parent_form: "case",
          editable: true,
          module_ids: List(["primeromodule-cp"]),
          form_group_id: "identification_registration",
          form_group_name: Map({
            en: "Identification / Registration",
            fr: "",
            ar: "",
            "ar-LB": "",
            so: "",
            es: ""
          }),
          fields: List([]),
          is_nested: null
        })
      ]);
      const forms = selectors.getRecordForms(stateWithRecords, {
        primeroModule: "primeromodule-cp",
        recordType: "case"
      });

      const [...formValues] = forms.values();

      expect(List(Object.keys(formValues["0"].toJS()))).to.deep.equal(List(Object.keys(expected.toJS()[0])));

      expect(Object.values(formValues["0"].toJS()).length).to.be.equal(Object.values(expected.toJS()[0]).length);
    });

    it("should return an empty array when there are not any options", () => {
      const record = selectors.getRecordForms(stateWithRecords, {});

      expect(record).to.be.equal(List([]));
    });
  });

  describe("getRecordFormsByUniqueId", () => {
    it("should return the record forms", () => {
      const expected = R.FormSectionRecord({
        id: 62,
        unique_id: "basic_identity",
        name: Map({
          en: "Basic Identity",
          fr: "",
          ar: "",
          "ar-LB": "",
          so: "",
          es: ""
        }),
        visible: true,
        is_first_tab: true,
        order: 10,
        order_form_group: 30,
        parent_form: "case",
        editable: true,
        module_ids: List(["primeromodule-cp"]),
        form_group_id: "identification_registration",
        form_group_name: Map({
          en: "Identification / Registration",
          fr: "",
          ar: "",
          "ar-LB": "",
          so: "",
          es: ""
        }),
        fields: [
          {
            date_include_time: false,
            date_validation: "default_date_validation",
            disabled: null,
            display_name: {
              ar: "",
              "ar-LB": "",
              en: "First Name",
              es: "",
              fr: "",
              so: ""
            },
            editable: true,
            href: null,
            guiding_questions: "",
            help_text: {},
            hide_on_view_page: false,
            link_to_form: "",
            multi_select: null,
            name: "name_first",
            option_strings_source: null,
            option_strings_text: null,
            order: null,
            required: true,
            selected_value: null,
            show_on_minify_form: true,
            subform_section_id: null,
            subform_sort_by: "",
            type: "text_field",
            visible: true,
            subform_section_configuration: null,
            tick_box_label: {}
          }
        ],
        is_nested: null
      });
      const forms = selectors.getRecordFormsByUniqueId(stateWithRecords, {
        primeroModule: "primeromodule-cp",
        recordType: "case",
        formName: "basic_identity"
      });

      expect(forms.toJS()[0]).to.deep.equal(expected.toJS());
    });

    it("should return an empty array when there are not any options", () => {
      const record = selectors.getRecordFormsByUniqueId(stateWithRecords, {});

      expect(record).to.be.equal(List([]));
    });

    it("should return form with visible false", () => {
      const expected = R.FormSectionRecord({
        id: 62,
        unique_id: "invisible_form",
        name: {
          en: "Invisible Form",
          fr: "",
          ar: "",
          "ar-LB": "",
          so: "",
          es: ""
        },
        visible: false,
        is_first_tab: true,
        order: 10,
        order_form_group: 30,
        parent_form: "case",
        editable: true,
        module_ids: ["primeromodule-cp"],
        form_group_id: "invisible",
        fields: [
          {
            date_include_time: false,
            date_validation: "default_date_validation",
            disabled: null,
            display_name: {
              ar: "",
              "ar-LB": "",
              en: "First Name",
              es: "",
              fr: "",
              so: ""
            },
            editable: true,
            guiding_questions: "",
            href: null,
            help_text: {},
            hide_on_view_page: false,
            link_to_form: "",
            multi_select: null,
            name: "name_first",
            option_strings_source: null,
            option_strings_text: null,
            order: null,
            required: true,
            selected_value: null,
            show_on_minify_form: true,
            subform_section_id: null,
            subform_sort_by: "",
            type: "text_field",
            visible: true,
            subform_section_configuration: null,
            tick_box_label: {}
          }
        ],
        is_nested: null
      });
      const forms = selectors.getRecordFormsByUniqueId(stateWithInvisibleForms, {
        primeroModule: "primeromodule-cp",
        recordType: "case",
        formName: "invisible_form",
        checkVisible: false
      });

      expect(forms.toJS()[0]).to.deep.equal(expected.toJS());
    });
  });

  describe("getFormNav", () => {
    const expected = OrderedMap({
      identification_registration: OrderedMap({
        "62": R.NavRecord({
          group: "identification_registration",
          groupOrder: 30,
          name: "Basic Identity",
          order: 10,
          formId: "basic_identity",
          is_first_tab: true
        })
      })
    });

    it("should return the forms nav", () => {
      const expectedNav = expected.set(
        "documents_group",
        OrderedMap({
          "63": R.NavRecord({
            group: "documents_group",
            groupOrder: 30,
            name: "Documents Form",
            order: 10,
            formId: "documents_form",
            is_first_tab: true
          })
        })
      );

      const record = selectors.getFormNav(stateWithRecords, {
        primeroModule: "primeromodule-cp",
        recordType: "case"
      });

      expect(record).to.deep.equal(expectedNav);
    });

    it("should not return form groupName", () => {
      const record = selectors.getFormNav(stateWithRecords, {
        primeroModule: "primeromodule-cp",
        recordType: "case"
      });

      expect(record?.groupName).to.not.exist;
    });

    it("should return an empty ordered map when there are not any options", () => {
      const record = selectors.getFormNav(stateWithRecords, {});

      expect(record).to.be.equal(OrderedMap({}));
    });

    it("should return an ordered map when there are options", () => {
      const record = selectors.getFormNav(
        stateWithRecords.setIn(["user", "permittedForms"], fromJS({ basic_identity: "rw" })),
        {
          primeroModule: "primeromodule-cp",
          recordType: "case",
          checkPermittedForms: true
        }
      );

      expect(record).to.be.equal(expected);
    });
  });

  describe("getFirstTab", () => {
    it("should return the forms nav", () => {
      const expected = R.FormSectionRecord({
        id: 62,
        unique_id: "basic_identity",
        name: {
          en: "Basic Identity",
          fr: "",
          ar: "",
          "ar-LB": "",
          so: "",
          es: ""
        },
        visible: true,
        is_first_tab: true,
        order: 10,
        order_form_group: 30,
        parent_form: "case",
        editable: true,
        module_ids: ["primeromodule-cp"],
        form_group_id: "identification_registration",
        form_group_name: {
          en: "Identification / Registration",
          fr: "",
          ar: "",
          "ar-LB": "",
          so: "",
          es: ""
        },
        fields: [1],
        is_nested: null
      });
      const record = selectors.getFirstTab(stateWithRecords, {
        primeroModule: "primeromodule-cp",
        recordType: "case"
      });

      expect(record).to.deep.equal(expected);
    });

    it("should return an empty ordered map when there are not any options", () => {
      const record = selectors.getFirstTab(stateWithRecords, {});

      expect(record).to.be.equal(null);
    });
  });

  describe("getOptions", () => {
    it("should return the options or lookups", () => {
      const expected = fromJS([serviceTypeLookup]);

      const record = selectors.getOptions(stateWithRecords);

      expect(record.size).to.be.equal(1);
      expect(record).to.be.deep.equal(expected);
    });

    it("should return an empty array when there are not any options", () => {
      const record = selectors.getOptions(stateWithNoRecords);

      expect(record).to.be.empty;
    });
  });

  describe("getLocations", () => {
    it("should return the options or lookups", () => {
      const expected = fromJS([location]);

      const record = selectors.getLocations(stateWithRecords);

      expect(record.size).to.be.equal(1);
      expect(record).to.be.deep.equal(expected);
    });

    it("should return an empty array when there are not any options", () => {
      const record = selectors.getLocations(stateWithNoRecords);

      expect(record).to.be.empty;
    });
  });

  describe("getAssignableForms", () => {
    it("should return the forms that can be assigned to a role", () => {
      const expected = fromJS(mapEntriesToRecord(formSections, R.FormSectionRecord));
      const forms = selectors.getAssignableForms(stateWithRecords);

      expect(forms).to.deep.equal(expected);
    });

    it("should return empty if there are not forms to assign", () => {
      const forms = selectors.getAssignableForms(stateWithNoRecords);

      expect(forms).to.be.empty;
    });

    it("should return empty if the forms are not assignable", () => {
      const forms = selectors.getAssignableForms(stateWithInvisibleForms);

      expect(forms).to.be.empty;
    });
  });

  describe("getServiceToRefer", () => {
    it("should return the service to refer", () => {
      const expected = fromJS(serviceToRefer);
      const result = selectors.getServiceToRefer(stateWithRecords);

      expect(result).to.deep.equal(expected);
    });

    it("should return empty if there is not a service to refer", () => {
      const forms = selectors.getAssignableForms(stateWithNoRecords);

      expect(forms).to.be.empty;
    });
  });

  describe("getValidationErrors", () => {
    it("should return the validation errors for the forms", () => {
      const expected = fromJS(validationErrors);

      const result = selectors.getValidationErrors(stateWithRecords);

      expect(result).to.deep.equal(expected);
    });
  });

  describe("getFieldByName", () => {
    it("should return the field if exists", () => {
      const expected = R.FieldRecord(fields["1"]);
      const result = selectors.getFieldByName(stateWithRecords, "name_first");

      expect(result).to.deep.equal(expected);
    });
  });

  describe("getFieldsWithNames", () => {
    it("should return an object with the field names", () => {
      const expected = fromJS({ document_field: R.FieldRecord(fields["2"]) });
      const result = selectors.getFieldsWithNames(stateWithRecords, ["document_field"]);

      expect(result).to.deep.equal(expected);
    });
  });

  describe("getFieldsWithNamesForMinifyForm", () => {
    it("should return an object with the field names for minify_form", () => {
      const fieldsForMinifyForm = {
        1: {
          name: "name_first",
          type: "text_field",
          editable: true,
          disabled: null,
          visible: true,
          display_name: {
            en: "First Name",
            fr: "",
            ar: "",
            "ar-LB": "",
            so: "",
            es: ""
          },
          subform_section_id: null,
          help_text: {},
          multi_select: null,
          option_strings_source: null,
          option_strings_text: null,
          guiding_questions: "",
          required: true,
          date_validation: "default_date_validation",
          href: null,
          show_on_minify_form: true
        },
        2: {
          name: "document_field",
          type: "document_upload_box",
          editable: true,
          disabled: null,
          visible: true,
          display_name: {
            en: "Document",
            fr: "",
            ar: "",
            "ar-LB": "",
            so: "",
            es: ""
          },
          subform_section_id: null,
          help_text: {},
          multi_select: null,
          option_strings_source: null,
          option_strings_text: null,
          guiding_questions: "",
          required: true,
          date_validation: "default_date_validation",
          href: null
        },
        3: {
          name: "age",
          type: "text_field",
          editable: true,
          disabled: null,
          visible: true,
          display_name: {
            en: "Age",
            fr: "",
            ar: ""
          },
          show_on_minify_form: true,
          help_text: {},
          multi_select: null,
          option_strings_source: null,
          option_strings_text: null,
          guiding_questions: "",
          required: true,
          date_validation: "default_date_validation",
          href: null
        },
        4: {
          name: "age",
          type: "text_field",
          editable: true,
          disabled: null,
          visible: true,
          display_name: {
            en: "Age",
            fr: "",
            ar: ""
          },
          show_on_minify_form: false,
          help_text: {},
          multi_select: null,
          option_strings_source: null,
          option_strings_text: null,
          guiding_questions: "",
          required: true,
          date_validation: "default_date_validation",
          href: null
        }
      };
      const stateForMinifyForm = fromJS({
        forms: {
          fields: mapEntriesToRecord(fieldsForMinifyForm, R.FieldRecord)
        }
      });
      const expected = fromJS({ age: R.FieldRecord(fieldsForMinifyForm["3"]) });
      const result = selectors.getFieldsWithNamesForMinifyForm(stateForMinifyForm, ["age"]);

      expect(result).to.deep.equal(expected);
    });
  });

  describe("getMiniFormFields", () => {
    it("should return show_on_minify_form fields for non nested forms", () => {
      const expected = fromJS([
        FieldRecord({
          name: "name_first",
          type: "text_field",
          visible: true,
          display_name: {
            en: "First Name",
            fr: "",
            ar: "",
            "ar-LB": "",
            so: "",
            es: ""
          },
          help_text: {},
          tick_box_label: {},
          date_validation: "default_date_validation",
          required: true,
          show_on_minify_form: true,
          selected_value: null
        })
      ]);
      const result = selectors.getMiniFormFields(stateWithRecords, "case", "primeromodule-cp");

      // Using toJS() since FieldRecord has empty mutable attributes
      expect(result.toList().toJS()).to.deep.equal(expected.toJS());
    });
  });

  describe("getRecordInformationForms", () => {
    it("should return the record information forms defined in the state", () => {
      const recordInformationForms = {
        61: {
          id: 61,
          unique_id: "record_owner",
          name: Map({ en: "Record Owner from State" }),
          visible: true,
          is_first_tab: true,
          order: 15,
          order_form_group: 1,
          parent_form: "case",
          editable: true,
          module_ids: List(["primeromodule-cp"]),
          form_group_id: RECORD_INFORMATION_GROUP,
          form_group_name: Map({ en: "Record Information" }),
          fields: List([]),
          is_nested: null,
          core_form: true
        },
        62: {
          id: 62,
          unique_id: "approvals",
          name: Map({ en: "Approvals from State" }),
          visible: true,
          is_first_tab: true,
          order: 16,
          order_form_group: 1,
          parent_form: "case",
          editable: true,
          module_ids: List(["primeromodule-cp"]),
          form_group_id: RECORD_INFORMATION_GROUP,
          form_group_name: Map({ en: "Record Information" }),
          fields: List([]),
          is_nested: null,
          core_form: true
        }
      };

      const result = selectors
        .getRecordInformationForms(
          fromJS({
            forms: {
              formSections: mapEntriesToRecord(recordInformationForms, R.FormSectionRecord)
            }
          }),
          { i18n: { t: v => v, locale: "en" }, recordType: "case", primeroModule: "primeromodule-cp" }
        )
        .valueSeq()
        .map(form => form.getIn(["name", "en"]))
        .toList()
        .sort();

      expect(result).to.deep.equal(
        fromJS([
          "Approvals from State",
          "Record Owner from State",
          "change_logs.label",
          "forms.record_types.referrals",
          "forms.record_types.transfers_assignments",
          "incidents.label"
        ])
      );
    });
  });

  it("should return the default record information forms if not defined in the state", () => {
    const i18n = { t: v => v, locale: "en" };
    const result = selectors
      .getRecordInformationForms(fromJS({}), {
        i18n,
        recordType: "case",
        primeroModule: "primeromodule-cp"
      })
      .valueSeq()
      .map(form => form.getIn(["name", "en"]))
      .toList()
      .sort();

    expect(result).to.deep.equal(
      fromJS([
        "change_logs.label",
        "forms.record_types.approvals",
        "forms.record_types.record_information",
        "forms.record_types.referrals",
        "forms.record_types.transfers_assignments",
        "incidents.label"
      ])
    );
  });

  describe("getRecordInformationFormIds", () => {
    it("should return unique_ids for the record information forms", () => {
      const i18n = { t: v => v, locale: "en" };

      const result = selectors
        .getRecordInformationFormIds(fromJS({}), {
          i18n,
          recordType: "case",
          primeroModule: "primeromodule-cp"
        })
        .toList()
        .sort();

      expect(result).to.deep.equals(
        fromJS([APPROVALS, CHANGE_LOGS, INCIDENT_FROM_CASE, RECORD_OWNER, REFERRAL, TRANSFERS_ASSIGNMENTS])
      );
    });
  });

  describe("getRecordInformationNav", () => {
    it("should return forms where the user has permissions", () => {
      const result = selectors
        .getRecordInformationNav(
          fromJS({
            user: {
              permissions: {
                case: [ACTIONS.CHANGE_LOG]
              }
            }
          }),
          {
            recordType: "case",
            primeroModule: "primeromodule-cp"
          }
        )
        .map(form => form.formId)
        .toList()
        .sort();

      expect(result).to.deep.equals(fromJS([CHANGE_LOGS, RECORD_OWNER, REFERRAL, TRANSFERS_ASSIGNMENTS]));
    });
  });
});
