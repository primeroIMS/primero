import chai, { expect } from "chai";
import { Map, List } from "immutable";
import { mapEntriesToRecord } from "libs";
import chaiImmutable from "chai-immutable";
import * as R from "./records";
import * as r from "./reducers";

chai.use(chaiImmutable);

describe("<RecordForm /> - Reducers", () => {
  const defaultState = Map({
    selectedForm: null,
    formSections: Map({}),
    fields: Map({})
  });

  it("should handle SELECTED_RECORD_SUCCESS", () => {
    const expected = Map({
      selectedForm: null,
      formSections: Map({}),
      fields: Map({}),
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
      }),
      errors: false
    });
    const action = {
      type: "forms/SELECTED_RECORD_SUCCESS",
      payload: {
        data: {
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
    };

    const newState = r.reducers.forms(defaultState, action);
    expect(newState).to.deep.equal(expected);
  });

  it("should handle SELECTED_RECORD_STARTED", () => {
    const expected = Map({
      selectedForm: null,
      formSections: Map({}),
      fields: Map({}),
      selectedRecord: null,
      loading: true
    });
    const action = {
      type: "forms/SELECTED_RECORD_STARTED"
    };

    const newState = r.reducers.forms(defaultState, action);
    expect(newState).to.deep.equal(expected);
  });

  it("should handle SELECTED_RECORD_FAILURE", () => {
    const expected = Map({
      selectedForm: null,
      formSections: Map({}),
      fields: Map({}),
      errors: true
    });
    const action = {
      type: "forms/SELECTED_RECORD_FAILURE"
    };

    const newState = r.reducers.forms(defaultState, action);
    expect(newState).to.deep.equal(expected);
  });

  it("should handle SET_OPTIONS", () => {
    const expected = Map({
      selectedForm: null,
      formSections: Map({}),
      fields: Map({}),
      options: List([
        Map({
          type: "lookup-location-type",
          options: List([
            Map({ id: "country", display_text: "Country" }),
            Map({ id: "region", display_text: "Region" })
          ])
        })
      ])
    });
    const action = {
      type: "forms/SET_OPTIONS",
      payload: [
        {
          type: "lookup-location-type",
          options: [
            { id: "country", display_text: "Country" },
            { id: "region", display_text: "Region" }
          ]
        }
      ]
    };

    const newState = r.reducers.forms(defaultState, action);
    expect(newState).to.deep.equal(expected);
  });

  it("should handle RECORD_FORMS_SUCCESS", () => {
    const formSections = [
      {
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
    ]
    const fields = [
      {
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
    ];
    const expectedState = Map({
      selectedForm: null,
      formSections: mapEntriesToRecord(formSections, R.FormSectionRecord),
      fields: mapEntriesToRecord(fields, R.FieldRecord)
    });
    const action = {
      type: "forms/RECORD_FORMS_SUCCESS",
      payload: {
        formSections,
        fields
      }
    };

    const newState = r.reducers.forms(defaultState, action);
    expect(newState).to.deep.equal(expectedState);
  });

  it("should handle SELECTED_RECORD_FAILURE", () => {
    const expected = Map({
      selectedForm: null,
      formSections: Map({}),
      fields: Map({}),
      errors: true
    });
    const action = {
      type: "forms/SELECTED_RECORD_FAILURE"
    };

    const newState = r.reducers.forms(defaultState, action);
    expect(newState).to.deep.equal(expected);
  });

  it("should handle RECORD_FORMS_STARTED", () => {
    const expected = Map({
      selectedForm: null,
      formSections: Map({}),
      fields: Map({}),
      errors: false,
      loading: true
    });
    const action = {
      type: "forms/RECORD_FORMS_STARTED"
    };

    const newState = r.reducers.forms(defaultState, action);
    expect(newState).to.deep.equal(expected);
  });

  it("should handle RECORD_FORMS_FINISHED", () => {
    const expected = Map({
      selectedForm: null,
      formSections: Map({}),
      fields: Map({}),
      loading: false
    });
    const action = {
      type: "forms/RECORD_FORMS_FINISHED"
    };

    const newState = r.reducers.forms(defaultState, action);
    expect(newState).to.deep.equal(expected);
  });

  it("should handle SET_SELECTED_FORM", () => {
    const expected = Map({
      selectedForm: "referral_transfer",
      formSections: Map({}),
      fields: Map({})
    });
    const action = {
      type: "forms/SET_SELECTED_FORM",
      payload: "referral_transfer"
    };

    const newState = r.reducers.forms(defaultState, action);
    expect(newState).to.deep.equal(expected);
  });
});
