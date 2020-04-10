import { expect } from "chai";
import { fromJS, OrderedMap } from "immutable";

import * as userActions from "../user/actions";

import { FieldRecord, FormSectionRecord } from "./records";
import reducer from "./reducer";
import actions from "./actions";

describe("<RecordForm /> - Reducers", () => {
  const defaultState = fromJS({
    selectedForm: null,
    formSections: OrderedMap({}),
    fields: OrderedMap({})
  });

  it("should handle SET_OPTIONS_SUCCESS", () => {
    const lookup = {
      id: 1,
      unique_id: "lookup-location-type",
      name: {
        en: "Location Type",
        fr: "",
        ar: "",
        "ar-LB": "",
        so: "",
        es: "",
        bn: ""
      }
    };
    const payload = [lookup];
    const expected = fromJS({
      selectedForm: null,
      formSections: OrderedMap({}),
      fields: OrderedMap({}),
      options: {
        lookups: [lookup]
      }
    });
    const action = {
      type: actions.SET_OPTIONS_SUCCESS,
      payload
    };

    const newState = reducer.forms(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SET_LOCATIONS_SUCCESS", () => {
    const location = {
      id: 1,
      code: "IDN",
      type: "country",
      name: {
        en: "IndonesiaEN",
        fr: "IndonesiaFR",
        ar: "",
        "ar-LB": "",
        so: "",
        es: "",
        bn: ""
      }
    };
    const payload = [location];
    const expected = fromJS({
      selectedForm: null,
      formSections: OrderedMap({}),
      fields: OrderedMap({}),
      options: {
        locations: [location]
      }
    });
    const action = {
      type: actions.SET_LOCATIONS_SUCCESS,
      payload
    };

    const newState = reducer.forms(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle RECORD_FORMS_SUCCESS", () => {
    const formSection = {
      id: 1,
      unique_id: "cp_incident_record_owner",
      parent_form: "incident",
      fields: [1]
    };
    const field = {
      id: 1,
      name: "current_owner_section",
      type: "separator",
      multi_select: false,
      form_section_id: 1,
      visible: true,
      mobile_visible: true
    };

    const payload = {
      formSections: [OrderedMap(formSection)],
      fields: [OrderedMap(field)]
    };
    const expected = fromJS({
      selectedForm: null,
      formSections: [
        FormSectionRecord({
          id: 1,
          unique_id: "cp_incident_record_owner",
          name: {},
          visible: null,
          is_first_tab: null,
          order: null,
          order_form_group: null,
          parent_form: "incident",
          editable: null,
          module_ids: [],
          form_group_id: "",
          form_group_name: "",
          fields: [1],
          is_nested: null,
          subform_prevent_item_removal: false,
          collapsed_field_names: []
        })
      ],
      attachmentFields: [],
      fields: [
        FieldRecord({
          name: "current_owner_section",
          type: "separator",
          editable: null,
          disabled: null,
          visible: true,
          display_name: {},
          subform_section_id: null,
          help_text: {},
          multi_select: false,
          option_strings_source: null,
          option_strings_text: null,
          guiding_questions: "",
          required: false,
          date_validation: null,
          hide_on_view_page: false,
          date_include_time: false,
          selected_value: "",
          subform_sort_by: "",
          show_on_minify_form: false
        })
      ]
    });
    const action = {
      type: actions.RECORD_FORMS_SUCCESS,
      payload
    };

    const newState = reducer.forms(defaultState, action);

    // TODO: toJS() is needed to compare the two objects because on recordTypes
    //  there are values that are not immutable
    expect(newState.toJS()).to.deep.equal(expected.toJS());
  });

  it("should handle RECORD_FORMS_FAILURE", () => {
    const expected = fromJS({
      selectedForm: null,
      formSections: OrderedMap({}),
      fields: OrderedMap({}),
      errors: true
    });
    const action = {
      type: actions.RECORD_FORMS_FAILURE,
      payload: true
    };

    const newState = reducer.forms(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle RECORD_FORMS_STARTED", () => {
    const expected = fromJS({
      selectedForm: null,
      formSections: OrderedMap({}),
      fields: OrderedMap({}),
      errors: false,
      loading: true
    });
    const action = {
      type: actions.RECORD_FORMS_STARTED,
      payload: true
    };

    const newState = reducer.forms(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle RECORD_FORMS_FINISHED", () => {
    const expected = fromJS({
      selectedForm: null,
      formSections: OrderedMap({}),
      fields: OrderedMap({}),
      loading: false
    });
    const action = {
      type: actions.RECORD_FORMS_FINISHED,
      payload: true
    };

    const newState = reducer.forms(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle user/LOGOUT_SUCCESS", () => {
    const expected = fromJS({
      selectedForm: null,
      formSections: OrderedMap({}),
      fields: OrderedMap({})
    });

    const action = {
      type: userActions.LOGOUT_SUCCESS,
      payload: true
    };

    const newState = reducer.forms(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle forms/FETCH_RECORD_ALERTS", () => {
    const data = [
      {
        alert_for: "field_change",
        type: "notes",
        date: "2020-04-02",
        form_unique_id: "notes"
      }
    ];
    const expected = fromJS({
      selectedForm: null,
      formSections: OrderedMap({}),
      fields: OrderedMap({}),
      recordAlerts: fromJS(data)
    });

    const action = {
      type: actions.FETCH_RECORD_ALERTS_SUCCESS,
      payload: {
        data
      }
    };

    const newState = reducer.forms(defaultState, action);

    expect(newState).to.deep.equals(expected);
  });

  it("should handle forms/FETCH_AGENCIES_FAILURE", () => {
    const expected = fromJS({
      selectedForm: null,
      formSections: OrderedMap({}),
      fields: OrderedMap({}),
      options: {
        errors: true
      }
    });

    const action = {
      type: actions.FETCH_AGENCIES_FAILURE
    };

    const newState = reducer.forms(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle forms/FETCH_AGENCIES_FINISHED", () => {
    const expected = fromJS({
      selectedForm: null,
      formSections: OrderedMap({}),
      fields: OrderedMap({}),
      options: {
        loading: false
      }
    });

    const action = {
      type: actions.FETCH_AGENCIES_FINISHED
    };

    const newState = reducer.forms(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle forms/FETCH_AGENCIES_STARTED", () => {
    const expected = fromJS({
      selectedForm: null,
      formSections: OrderedMap({}),
      fields: OrderedMap({}),
      options: {
        loading: true
      }
    });

    const action = {
      type: actions.FETCH_AGENCIES_STARTED
    };

    const newState = reducer.forms(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle forms/FETCH_AGENCIES_SUCCESS", () => {
    const agencies = [
      { unique_id: "agency-id-1", agency_code: "a1" },
      { unique_id: "agency-id-2", agency_code: "a2" }
    ];

    const expected = fromJS({
      selectedForm: null,
      formSections: OrderedMap({}),
      fields: OrderedMap({}),
      options: {
        errors: false,
        agencies
      }
    });

    const action = {
      type: actions.FETCH_AGENCIES_SUCCESS,
      payload: {
        data: agencies
      }
    };

    const newState = reducer.forms(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle forms/SET_SELECTED_FORM", () => {
    const selectedForm = fromJS({
      id: 1,
      unique_id: "cp_incident_record_owner",
      name: {},
      visible: null,
      is_first_tab: null,
      order: null,
      order_form_group: null,
      parent_form: "incident",
      editable: null,
      module_ids: [],
      form_group_id: "",
      form_group_name: "",
      fields: [1],
      is_nested: null,
      subform_prevent_item_removal: false,
      collapsed_field_names: []
    });

    const expected = fromJS({
      formSections: OrderedMap({}),
      fields: OrderedMap({}),
      selectedForm
    });

    const action = {
      type: actions.SET_SELECTED_FORM,
      payload: selectedForm
    };

    const newState = reducer.forms(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle forms/SET_SELECTED_RECORD", () => {
    const selectedRecord = fromJS({
      unique_id: "record-1",
      last_name: "name_last",
      first_name: "name_first"
    });

    const expected = fromJS({
      selectedForm: null,
      formSections: OrderedMap({}),
      fields: OrderedMap({}),
      selectedRecord
    });

    const action = {
      type: actions.SET_SELECTED_RECORD,
      payload: selectedRecord
    };

    const newState = reducer.forms(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle forms/SET_SERVICE_TO_REFER", () => {
    const serviceToRefer = fromJS({
      service_implementing_agency: "agency-1",
      service_implementing_agency_individual: "user-1",
      service_type: "type-1"
    });

    const expected = fromJS({
      selectedForm: null,
      formSections: OrderedMap({}),
      fields: OrderedMap({}),
      serviceToRefer
    });

    const action = {
      type: actions.SET_SERVICE_TO_REFER,
      payload: serviceToRefer
    };

    const newState = reducer.forms(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });
});
