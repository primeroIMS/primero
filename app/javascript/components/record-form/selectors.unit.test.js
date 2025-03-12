// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Map, List, OrderedMap, fromJS } from "immutable";
import { expect } from "chai";

import { mapEntriesToRecord } from "../../libs";
import { ACTIONS } from "../permissions";
import {
  APPROVALS,
  CHANGE_LOGS,
  IDENTIFICATION_REGISTRATION,
  INCIDENT_FROM_CASE,
  RECORD_INFORMATION_GROUP,
  RECORD_OWNER,
  REFERRAL,
  SERVICES_SUBFORM_FIELD,
  TRANSFERS_ASSIGNMENTS
} from "../../config";
import { FieldRecord, SEPARATOR, SUBFORM_SECTION, TEXT_FIELD } from "../form";

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
            form_section_id: null,
            form_section_name: null,
            href: null,
            guiding_questions: "",
            help_text: {},
            hidden_text_field: false,
            hide_on_view_page: false,
            link_to_form: "",
            module_ids: null,
            multi_select: null,
            name: "name_first",
            option_strings_source: null,
            option_strings_text: null,
            option_strings_condition: null,
            order: null,
            parent_form: null,
            required: true,
            selected_value: null,
            showIf: null,
            show_on_minify_form: true,
            subform_section_id: null,
            subform_summary: null,
            subform_sort_by: "",
            type: "text_field",
            visible: true,
            watchedInputs: null,
            subform_section_configuration: null,
            tick_box_label: {},
            display_conditions_record: undefined,
            display_conditions_subform: undefined,
            autosum_total: true,
            tally: {},
            collapse: null,
            calculation: {}
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
            form_section_id: null,
            form_section_name: null,
            guiding_questions: "",
            href: null,
            help_text: {},
            hidden_text_field: false,
            hide_on_view_page: false,
            link_to_form: "",
            module_ids: null,
            multi_select: null,
            name: "name_first",
            option_strings_source: null,
            option_strings_text: null,
            option_strings_condition: null,
            order: null,
            parent_form: null,
            required: true,
            selected_value: null,
            showIf: null,
            show_on_minify_form: true,
            subform_section_id: null,
            subform_summary: null,
            subform_sort_by: "",
            type: "text_field",
            visible: true,
            watchedInputs: null,
            subform_section_configuration: null,
            tick_box_label: {},
            display_conditions_record: undefined,
            display_conditions_subform: undefined,
            autosum_total: true,
            tally: {},
            collapse: null,
            calculation: {}
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
        62: R.NavRecord({
          group: "identification_registration",
          groupOrder: 30,
          name: "Basic Identity",
          order: 10,
          formId: "basic_identity",
          is_first_tab: true,
          display_conditions: []
        })
      })
    });

    it("should return the forms nav", () => {
      const expectedNav = expected.set(
        "documents_group",
        OrderedMap({
          63: R.NavRecord({
            group: "documents_group",
            groupOrder: 30,
            name: "Documents Form",
            order: 10,
            formId: "documents_form",
            is_first_tab: true,
            display_conditions: []
          })
        })
      );

      const record = selectors.getFormNav(stateWithRecords, {
        primeroModule: "primeromodule-cp",
        recordType: "case"
      });

      expect([...record.keys()]).to.deep.equal([...expectedNav.keys()]);
      expect([...record.values()]).to.deep.equal([...expectedNav.values()]);
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

      expect([...record.keys()]).to.deep.equal([...expected.keys()]);
      expect([...record.values()]).to.deep.equal([...expected.values()]);
    });

    context("when the summary form exist", () => {
      const formSectionsWithSummary = {
        1: {
          id: 1,
          unique_id: "test_form",
          name: {
            en: "Test Form"
          },
          visible: true,
          is_first_tab: true,
          order: 10,
          order_form_group: 30,
          parent_form: "case",
          editable: true,
          module_ids: ["primeromodule-cp"],
          form_group_id: "test_group",
          form_group_name: {
            en: "Test Group"
          },
          forms: [],
          is_nested: null
        },
        2: {
          id: 2,
          unique_id: "summary",
          name: {
            en: "Summary"
          },
          visible: true,
          is_first_tab: false,
          order: 10,
          order_form_group: 30,
          parent_form: "case",
          editable: true,
          module_ids: ["primeromodule-cp"],
          form_group_id: "tracing",
          form_group_name: {
            en: "Tracing"
          },
          is_nested: null
        }
      };
      const stateWithUserPermission = fromJS({
        forms: {
          formSections: mapEntriesToRecord(formSectionsWithSummary, R.FormSectionRecord)
        }
      });

      it("should return summary if the user has the permission", () => {
        const record = selectors.getFormNav(
          stateWithUserPermission.set(
            "user",
            fromJS({
              permissions: {
                cases: [ACTIONS.FIND_TRACING_MATCH]
              }
            })
          ),
          {
            primeroModule: "primeromodule-cp",
            recordType: "case",
            checkPermittedForms: true
          }
        );

        expect(record).to.have.property("tracing");
      });

      it("should NOT return summary if the user has not the permission", () => {
        const record = selectors.getFormNav(stateWithUserPermission, {
          primeroModule: "primeromodule-cp",
          recordType: "case",
          checkPermittedForms: true
        });

        expect(record).to.not.have.property("tracing");
      });

      it("should return summary if the record has the permission", () => {
        const record = selectors.getFormNav(
          stateWithUserPermission.set(
            "records",
            fromJS({
              cases: {
                data: [{ id: "001", permitted_form_actions: { case: [ACTIONS.FIND_TRACING_MATCH] } }],
                selectedRecord: "001"
              }
            })
          ),
          {
            primeroModule: "primeromodule-cp",
            recordType: "case",
            checkPermittedForms: true
          }
        );

        expect(record).to.have.property("tracing");
      });
    });
  });

  describe("getFirstTab", () => {
    it("should return the forms nav", () => {
      const expected = R.FormSectionRecord({
        id: 62,
        unique_id: "basic_identity",
        description: {},
        name: { en: "Basic Identity", fr: "", ar: "", "ar-LB": "", so: "", es: "" },
        visible: true,
        is_first_tab: true,
        order: 10,
        order_form_group: 30,
        parent_form: "case",
        editable: true,
        module_ids: ["primeromodule-cp"],
        form_group_id: "identification_registration",
        fields: [1],
        is_nested: null,
        subform_prevent_item_removal: false,
        collapsed_field_names: [],
        subform_append_only: false,
        initial_subforms: 0,
        core_form: false,
        i18nName: false,
        i18nDescription: false
      });
      const record = selectors.getFirstTab(stateWithRecords, {
        primeroModule: "primeromodule-cp",
        recordType: "case"
      });

      expect(record.toJS()).to.deep.equal(expected.toJS());
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

    it("does not return the excluded fields for the show_on_minify_form fields", () => {
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
      const result = selectors.getMiniFormFields(stateWithRecords, "case", "primeromodule-cp", ["name_first"]);

      // Using toJS() since FieldRecord has empty mutable attributes
      expect(result.toList().toJS()).to.deep.equal([]);
    });

    it("it returns the show_on_minify_form fields as common fields", () => {
      const expected = fromJS({
        name_first: FieldRecord({
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
      });
      const result = selectors.getCommonMiniFormFields(stateWithRecords, "case", "primeromodule-cp", ["name_first"]);

      // Using toJS() since FieldRecord has empty mutable attributes
      expect(result.toJS()).to.deep.equal(expected.toJS());
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
        },
        63: {
          id: 63,
          unique_id: "incident_from_case",
          name: Map({ en: "Incidents from state" }),
          visible: true,
          is_first_tab: true,
          order: 16,
          order_form_group: 1,
          parent_form: "case",
          editable: true,
          module_ids: List(["primeromodule-cp"]),
          form_group_id: IDENTIFICATION_REGISTRATION,
          form_group_name: Map({ en: "Identification / Registration" }),
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
          "forms.record_types.transfers_assignments"
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
                cases: [ACTIONS.CHANGE_LOG]
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

    it("should return forms where the record has permissions", () => {
      const result = selectors
        .getRecordInformationNav(
          fromJS({
            records: {
              cases: {
                data: [{ id: "001", permitted_form_actions: { case: [ACTIONS.CHANGE_LOG] } }],
                selectedRecord: "001"
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

  describe("getDuplicatedFieldAlerts", () => {
    it("returns the duplicate field alerts", () => {
      const duplicatedAlert = { alert_for: "duplicate_field", type: "id_field", form_unique_id: "form1" };
      const recordAlerts = fromJS([
        duplicatedAlert,
        { alert_for: "approval", type: "assessment", form_unique_id: "form1" }
      ]);
      const state = fromJS({ records: { cases: { recordAlerts } } });

      expect(selectors.getDuplicatedFieldAlerts(state, "cases", "form1")).to.deep.equals(fromJS([duplicatedAlert]));
    });
  });

  describe("getDuplicatedFields", () => {
    it("returns the duplicated fields", () => {
      const duplicatedAlert = { alert_for: "duplicate_field", type: "id_field", form_unique_id: "form1" };
      const field = FieldRecord({ name: "id_field" });
      const recordAlerts = fromJS([
        duplicatedAlert,
        { alert_for: "approval", type: "assessment", form_unique_id: "form1" }
      ]);
      const state = fromJS({ records: { cases: { recordAlerts } }, forms: { fields: [field] } });

      expect(selectors.getDuplicatedFields(state, "cases", "form1")).to.deep.equals(fromJS([field]));
    });
  });

  describe("getRecordFields", () => {
    it("returns the record fields and omits duplicates", () => {
      const formsWithDuplicates = {
        10: {
          id: 10,
          unique_id: "form_1",
          name: { en: "Form 1" },
          visible: true,
          parent_form: "case",
          module_ids: ["primeromodule-cp"],
          form_group_id: "identification_registration",
          form_group_name: { en: "Identification / Registration" },
          fields: [1],
          is_nested: null
        },
        20: {
          id: 10,
          unique_id: "form_2",
          name: { en: "Form 2" },
          visible: true,
          parent_form: "case",
          module_ids: ["primeromodule-cp"],
          form_group_id: "identification_registration",
          form_group_name: { en: "Identification / Registration" },
          fields: [1],
          is_nested: null
        }
      };
      const duplicatedFields = {
        1: {
          name: "name_first",
          type: "text_field",
          editable: true,
          disabled: null,
          visible: true,
          display_name: { en: "First Name" },
          required: true,
          date_validation: "default_date_validation"
        }
      };

      const stateWithDuplicateFields = fromJS({
        forms: {
          formSections: mapEntriesToRecord(formsWithDuplicates, R.FormSectionRecord),
          fields: mapEntriesToRecord(duplicatedFields, R.FieldRecord)
        }
      });

      expect(
        selectors
          .getRecordFields(stateWithDuplicateFields, {
            recordType: "case",
            primeroModule: "primeromodule-cp",
            includeNested: false,
            excludeTypes: [SEPARATOR],
            omitDuplicates: true
          })
          .map(field => field.name)
      ).to.deep.equals(fromJS(["name_first"]));
    });

    it("returns the record fields and exclude some field types", () => {
      const formsWithDuplicates = {
        10: {
          id: 10,
          unique_id: "form_1",
          name: { en: "Form 1" },
          visible: true,
          parent_form: "case",
          module_ids: ["primeromodule-cp"],
          form_group_id: "identification_registration",
          form_group_name: { en: "Identification / Registration" },
          fields: [1, 2, 3],
          is_nested: null
        }
      };
      const formFields = {
        1: {
          name: "name_first",
          type: "text_field",
          editable: true,
          disabled: null,
          visible: true,
          display_name: { en: "First Name" },
          required: true,
          date_validation: "default_date_validation"
        },
        2: {
          name: "header",
          type: "separator",
          editable: true,
          disabled: null,
          visible: true,
          display_name: { en: "Header" },
          required: false,
          date_validation: "default_date_validation"
        },
        3: {
          name: "sex",
          type: "select_box",
          editable: true,
          disabled: null,
          visible: true,
          display_name: { en: "Sex" },
          required: false,
          option_strings_source: "lookup lookup-sex",
          date_validation: "default_date_validation"
        }
      };

      const stateWithDuplicateFields = fromJS({
        forms: {
          formSections: mapEntriesToRecord(formsWithDuplicates, R.FormSectionRecord),
          fields: mapEntriesToRecord(formFields, R.FieldRecord)
        }
      });

      expect(
        selectors
          .getRecordFields(stateWithDuplicateFields, {
            recordType: "case",
            primeroModule: "primeromodule-cp",
            includeNested: false,
            excludeTypes: [SEPARATOR, TEXT_FIELD],
            omitDuplicates: true
          })
          .map(field => field.name)
      ).to.deep.equals(fromJS(["sex"]));
    });
  });

  describe("getNestedFields", () => {
    it("returns the nested fields", () => {
      const formsWithDuplicates = {
        20: {
          id: 20,
          unique_id: "form_2",
          name: { en: "Nested Form 2" },
          visible: true,
          module_ids: ["primeromodule-cp"],
          form_group_id: "identification_registration",
          form_group_name: { en: "Identification / Registration" },
          fields: [1],
          is_nested: true
        }
      };
      const nestedFields = {
        1: {
          name: "name_first",
          type: "text_field",
          editable: true,
          disabled: null,
          visible: true,
          display_name: { en: "First Name" },
          required: true,
          date_validation: "default_date_validation"
        }
      };

      const stateWithDuplicateFields = fromJS({
        forms: {
          formSections: mapEntriesToRecord(formsWithDuplicates, R.FormSectionRecord),
          fields: mapEntriesToRecord(nestedFields, R.FieldRecord)
        }
      });

      expect(
        selectors
          .getNestedFields(stateWithDuplicateFields, {
            recordType: "case",
            primeroModule: "primeromodule-cp",
            includeNested: true,
            excludeTypes: [SEPARATOR],
            omitDuplicates: true,
            nestedFormIds: [20]
          })
          .map(field => field.name)
      ).to.deep.equals(fromJS(["name_first"]));
    });
  });

  describe("getPreviousRecordType", () => {
    it("returns the previousRecordType", () => {
      const stateWithPreviousRecord = fromJS({
        forms: { previousRecord: { id: "001", recordType: "cases" } }
      });

      expect(selectors.getPreviousRecordType(stateWithPreviousRecord)).to.equals("cases");
    });
  });

  describe("getPermittedForms", () => {
    const permittedForms = fromJS({ form_1: "rw", form_2: "r", form_3: "rw" });
    const recordForms = fromJS({ form_1: "rw", form_4: "r" });
    const stateWithForms = fromJS({
      user: { permittedForms },
      records: { cases: { data: [{ id: "0001", permitted_forms: recordForms }] } }
    });

    it("returns the permitted forms for the user", () => {
      expect(selectors.getPermittedForms(stateWithForms, {})).to.deep.equals(permittedForms);
    });

    it("returns the permitted forms for the record", () => {
      expect(
        selectors.getPermittedForms(stateWithForms, { recordType: "case", recordId: "0001", isEditOrShow: true })
      ).to.deep.equals(recordForms);
    });

    it("returns the permitted forms for the user if the record is not found", () => {
      expect(
        selectors.getPermittedForms(stateWithForms, { recordType: "case", recordId: "0002", isEditOrShow: true })
      ).to.deep.equals(permittedForms);
    });
  });

  describe("getIsServicesForm", () => {
    const state = fromJS({
      forms: {
        formSections: mapEntriesToRecord(
          {
            1: {
              id: 1,
              unique_id: "services",
              name: Map({ en: "Services" }),
              visible: true,
              is_first_tab: true,
              order: 10,
              order_form_group: 1,
              parent_form: "case",
              editable: true,
              module_ids: List(["primeromodule-cp"]),
              form_group_id: "group_1",
              form_group_name: Map({ en: "Group 1" }),
              fields: [1],
              is_nested: null
            },
            2: {
              id: 2,
              unique_id: "basic_identity",
              name: Map({ en: "Basic Identity" }),
              visible: true,
              is_first_tab: true,
              order: 20,
              order_form_group: 1,
              parent_form: "case",
              editable: true,
              module_ids: List(["primeromodule-cp"]),
              form_group_id: "group_1",
              form_group_name: Map({ en: "Group 1" }),
              fields: [],
              is_nested: null
            }
          },
          R.FormSectionRecord
        ),
        fields: mapEntriesToRecord(
          {
            1: {
              name: SERVICES_SUBFORM_FIELD,
              display_name: {
                en: "Services Subform Section",
                fr: "",
                ar: "",
                so: "",
                es: ""
              },
              type: SUBFORM_SECTION
            }
          },
          R.FieldRecord
        )
      }
    });

    it("returns true if the form contains a services_section subform", () => {
      expect(selectors.getIsServicesForm(state, { recordType: "case", formName: "services" })).to.be.true;
    });

    it("returns false if the form contains a services_section subform", () => {
      expect(selectors.getIsServicesForm(state, { recordType: "case", formName: "basic_identity" })).to.be.false;
    });
  });

  describe("getSubFormForFieldName", () => {
    const state = fromJS({
      forms: {
        formSections: mapEntriesToRecord(
          {
            1: {
              id: 1,
              unique_id: "services",
              name: Map({ en: "Services" }),
              visible: true,
              is_first_tab: true,
              order: 10,
              order_form_group: 1,
              parent_form: "case",
              editable: true,
              module_ids: List(["primeromodule-cp"]),
              form_group_id: "group_1",
              form_group_name: Map({ en: "Group 1" }),
              fields: [1],
              is_nested: null
            },
            2: {
              id: 2,
              unique_id: "basic_identity",
              name: Map({ en: "Basic Identity" }),
              visible: true,
              is_first_tab: true,
              order: 20,
              order_form_group: 1,
              parent_form: "case",
              editable: true,
              module_ids: List(["primeromodule-cp"]),
              form_group_id: "group_1",
              form_group_name: Map({ en: "Group 1" }),
              fields: [],
              is_nested: null
            },
            3: {
              id: 3,
              unique_id: "nested_services",
              name: Map({ en: "Nested Services" }),
              visible: true,
              is_first_tab: true,
              order: 10,
              order_form_group: 1,
              parent_form: "case",
              editable: true,
              module_ids: List(["primeromodule-cp"]),
              form_group_id: "group_1",
              form_group_name: Map({ en: "Group 1" }),
              fields: [1],
              is_nested: null
            }
          },
          R.FormSectionRecord
        ),
        fields: mapEntriesToRecord(
          {
            1: {
              name: SERVICES_SUBFORM_FIELD,
              display_name: {
                en: "Services Subform Section",
                fr: "",
                ar: "",
                so: "",
                es: ""
              },
              type: SUBFORM_SECTION,
              subform_section_id: 3
            }
          },
          R.FieldRecord
        )
      }
    });

    it("returns the subform associated to the field name", () => {
      const subform = selectors.getSubFormForFieldName(state, {
        recordType: "case",
        fieldName: SERVICES_SUBFORM_FIELD
      });

      expect(subform.id).to.equals(3);
      expect(subform.unique_id).to.equals("nested_services");
    });
  });
});
