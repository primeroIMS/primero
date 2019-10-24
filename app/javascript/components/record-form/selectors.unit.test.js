import "test/test.setup";
import chai, { expect } from "chai";
import { Map, List, OrderedMap } from "immutable";
import { mapEntriesToRecord } from "libs";
import chaiImmutable from "chai-immutable";
import * as R from "./records";

import * as selectors from "./selectors";

chai.use(chaiImmutable);

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
const stateWithNoRecords = Map({});
const stateWithRecords = Map({
  ui: Map({
    I18n: Map({
      locale: "en",
      dir: "ltr"
    })
  }),
  forms: Map({
    selectedForm: "basic_identity",
    formSections: mapEntriesToRecord(formSections, R.FormSectionRecord),
    fields: mapEntriesToRecord(fields, R.FieldRecord),
    loading: true,
    errors: true,
    options: List([
      R.Option({
        type: "lookup-location-type",
        options: [
          { id: "country", display_text: "Country" },
          { id: "region", display_text: "Region" }
        ]
      })
    ]),
    selectedRecord: Map({
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
    })
  })
});

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
        "lookup-location-type"
      );

      expect(Object.keys(record)).to.deep.equal(Object.keys(expected));
      expect(Object.values(record)).to.deep.equal(Object.values(expected));
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

      const [...formValues] = forms.values()

      expect(List(Object.keys(formValues['0'].toJS()))).to.deep.equal(
        List(Object.keys(expected.toJS()[0]))
      );

      expect(Object.values(formValues['0'].toJS()).length).to.be.equal(
        Object.values(expected.toJS()[0]).length
      );
    });

    it("should return an empty array when there are not any options", () => {
      const record = selectors.getRecordForms(stateWithRecords, {});
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
});
