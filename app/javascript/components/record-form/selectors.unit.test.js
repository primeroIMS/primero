import { Map, List, OrderedMap, fromJS } from "immutable";

import { mapEntriesToRecord } from "../../libs";

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
    date_validation: "default_date_validation"
  }
};
const serviceTypeLookup = {
  id: 1,
  unique_id: "lookup-location-type",
  values: [
    { id: "country", display_text: "Country" },
    { id: "region", display_text: "Region" }
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

const agency1 = {
  unique_id: "agency-test-1",
  agency_code: "test1",
  disabled: false,
  services: ["service_test_1"]
};

const agency2 = {
  unique_id: "agency-test-2",
  agency_code: "test2",
  disabled: false,
  services: ["service_test_1", "service_test_2"]
};

const agency3 = {
  unique_id: "agency-test-3",
  agency_code: "test3",
  disabled: true,
  services: ["service_test_1"]
};

const stateWithNoRecords = Map({});
const stateWithRecords = fromJS({
  ui: {
    I18n: {
      locale: "en",
      dir: "ltr"
    }
  },
  forms: {
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
      lookups: { data: [serviceTypeLookup] },
      locations: [location],
      agencies: [agency1, agency2, agency3]
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
    }
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
        { id: "country", display_text: "Country" },
        { id: "region", display_text: "Region" }
      ];

      const record = selectors.getOption(
        stateWithRecords,
        "lookup lookup-location-type"
      );

      expect(Object.keys(record)).to.deep.equal(Object.keys(expected));
      expect(Object.values(record)).to.deep.equal(Object.values(expected));
      expect(record).to.deep.equal(expected);
    });

    it("should return an empty array when there are not any options", () => {
      const record = selectors.getOption(stateWithNoRecords);

      expect(record).to.be.empty;
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

      expect(List(Object.keys(formValues["0"].toJS()))).to.deep.equal(
        List(Object.keys(expected.toJS()[0]))
      );

      expect(Object.values(formValues["0"].toJS()).length).to.be.equal(
        Object.values(expected.toJS()[0]).length
      );
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
            guiding_questions: "",
            help_text: {},
            hide_on_view_page: false,
            multi_select: null,
            name: "name_first",
            option_strings_source: null,
            option_strings_text: null,
            required: true,
            selected_value: "",
            show_on_minify_form: false,
            subform_section_id: null,
            subform_sort_by: "",
            type: "text_field",
            visible: true
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
  });

  describe("getFormNav", () => {
    it("should return the forms nav", () => {
      const expected = OrderedMap({
        identification_registration: OrderedMap({
          "62": R.NavRecord({
            group: "identification_registration",
            groupName: "Identification / Registration",
            groupOrder: 30,
            name: "Basic Identity",
            order: 10,
            formId: "basic_identity",
            is_first_tab: true
          })
        })
      });
      const record = selectors.getFormNav(stateWithRecords, {
        primeroModule: "primeromodule-cp",
        recordType: "case"
      });

      expect(record).to.deep.equal(expected);
    });

    it("should return an empty ordered map when there are not any options", () => {
      const record = selectors.getFormNav(stateWithRecords, {});

      expect(record).to.be.equal(OrderedMap({}));
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

  describe("getRecordAlerts", () => {
    it("should return the list of alerts", () => {
      const expected = fromJS([
        {
          alert_for: "field_change",
          type: "notes",
          date: "2020-04-02",
          form_unique_id: "notes"
        }
      ]);

      expect(selectors.getRecordAlerts(stateWithRecords)).to.deep.equals(
        expected
      );
    });

    it("should return an empty array when there are not any options", () => {
      const record = selectors.getRecordAlerts(stateWithNoRecords);

      expect(record).to.be.empty;
    });
  });

  describe("getAssignableForms", () => {
    it("should return the forms that can be assigned to a role", () => {
      const expected = fromJS(
        mapEntriesToRecord(formSections, R.FormSectionRecord)
      );
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

  describe("getEnabledAgencies", () => {
    it("should return the enabled agencies", () => {
      const expected = fromJS([agency1, agency2]);
      const enabledAgencies = selectors.getEnabledAgencies(stateWithRecords);

      expect(enabledAgencies).to.deep.equal(expected);
    });

    it("should return enabled agencies with the selected service", () => {
      const expected = fromJS([agency2]);
      const agenciesWithService = selectors.getEnabledAgencies(
        stateWithRecords,
        "service_test_2"
      );

      expect(agenciesWithService).to.deep.equal(expected);
    });

    it("should return empty if there are no agencies with the selected service", () => {
      const agenciesWithService = selectors.getEnabledAgencies(
        stateWithRecords,
        "service_test_5"
      );

      expect(agenciesWithService).to.be.empty;
    });

    it("should return empty if there are no enabled agencies", () => {
      const enabledAgencies = selectors.getAssignableForms(stateWithNoRecords);

      expect(enabledAgencies).to.be.empty;
    });
  });
});
