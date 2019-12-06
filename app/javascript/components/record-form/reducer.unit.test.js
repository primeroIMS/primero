import chai, { expect } from "chai";
import { Map, List } from "immutable";
import chaiImmutable from "chai-immutable";

import { mapEntriesToRecord } from "../../libs";

import * as R from "./records";
import * as r from "./reducers";

chai.use(chaiImmutable);

describe("<RecordForm /> - Reducers", () => {
  const initialState = Map({
    selectedForm: null,
    formSections: Map({}),
    fields: Map({})
  });

  it("deprecated forms/SET_OPTIONS", () => {
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

    const newState = r.reducers.forms(initialState, action);

    expect(newState).to.deep.equal(initialState);
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
    ];
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

    const newState = r.reducers.forms(initialState, action);

    expect(newState).to.deep.equal(expectedState);
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

    const newState = r.reducers.forms(initialState, action);

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

    const newState = r.reducers.forms(initialState, action);

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

    const newState = r.reducers.forms(initialState, action);

    expect(newState).to.deep.equal(expected);
  });
});
