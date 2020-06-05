import { fromJS } from "immutable";

import { RADIO_FIELD } from "../../../form";

import actions from "./actions";
import reducer from "./reducer";
import { NEW_FIELD } from "./constants";

describe("<FormsBuilder /> - Reducers", () => {
  const initialState = fromJS({});

  it("should handle SAVE_FORM_FAILURE", () => {
    const expected = fromJS({
      serverErrors: ["some error"],
      errors: true
    });

    const action = {
      type: actions.SAVE_FORM_FAILURE,
      payload: {
        errors: ["some error"]
      }
    };

    const newState = reducer(initialState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SAVE_FORM_STARTED", () => {
    const expected = fromJS({
      saving: true
    });

    const action = {
      type: actions.SAVE_FORM_STARTED
    };

    const newState = reducer(initialState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SAVE_FORM_FINISHED", () => {
    const expected = fromJS({
      saving: false
    });

    const action = {
      type: actions.SAVE_FORM_FINISHED
    };

    const newState = reducer(initialState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle CLEAR_SELECTED_FORM", () => {
    const expected = fromJS({
      selectedForm: {},
      errors: false,
      serverErrors: []
    });

    const action = {
      type: actions.CLEAR_SELECTED_FORM
    };

    const newState = reducer(initialState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_FORM_FAILURE", () => {
    const expected = fromJS({
      errors: true,
      serverErrors: ["some error"]
    });

    const action = {
      type: actions.FETCH_FORM_FAILURE,
      payload: {
        errors: ["some error"]
      }
    };

    const newState = reducer(initialState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_FORM_FINISHED", () => {
    const expected = fromJS({
      loading: false
    });

    const action = {
      type: actions.FETCH_FORM_FINISHED,
      payload: false
    };

    const newState = reducer(initialState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_FORM_STARTED", () => {
    const expected = fromJS({
      loading: true,
      errors: false,
      serverErrors: []
    });

    const action = {
      type: actions.FETCH_FORM_STARTED,
      payload: true
    };

    const newState = reducer(initialState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_FORM_SUCCESS", () => {
    const selectedForm = { id: 1, name: { en: "Form 1" } };

    const expected = fromJS({
      selectedForm,
      selectedFields: selectedForm.fields,
      errors: false,
      serverErrors: []
    });

    const action = {
      type: actions.FETCH_FORM_SUCCESS,
      payload: { data: selectedForm }
    };

    const newState = reducer(initialState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SET_NEW_FIELD", () => {
    const data = {
      name: NEW_FIELD,
      type: RADIO_FIELD
    };
    const expected = fromJS({
      selectedField: data
    });

    const action = {
      type: actions.SET_NEW_FIELD,
      payload: data
    };

    const newState = reducer(initialState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle CREATE_SELECTED_FIELD", () => {
    const initialStateCreateField = fromJS({ selectedFields: []});
    const objectData = {
      display_name: {
        en: "test 4"
      },
      help_text: {
        en: "test 4"
      },
      guiding_questions: {
        en: ""
      },
      required: false,
      visible: false,
      mobile_visible: false,
      hide_on_view_page: false,
      show_on_minify_form: false,
      type: RADIO_FIELD,
      name: "test_4"
    };
    const expected = fromJS({
      selectedFields: [objectData]
    });

    const action = {
      type: actions.CREATE_SELECTED_FIELD,
      payload: {
        data: {
          test_4: objectData
        }
      }
    };

    const newState = reducer(initialStateCreateField, action);

    expect(newState).to.deep.equal(expected);
  });

  describe("REORDER_FIELDS", () => {
    const stateWithFields = fromJS({
      selectedFields: [
        { name: "field_1", order: 0 },
        { name: "field_2", order: 1 },
        { name: "field_3", order: 2 }
      ]
    });

    it("should handle a field going down in the order", () => {
      const expected = fromJS({
        selectedFields: [
          { name: "field_1", order: 2 },
          { name: "field_2", order: 0 },
          { name: "field_3", order: 1 }
        ]
      });

      const action = {
        type: actions.REORDER_FIELDS,
        payload: { name: "field_1", order: 2 }
      };

      const newState = reducer(stateWithFields, action);

      expect(newState).to.deep.equal(expected);
    });

    it("should handle a field going up in the order", () => {
      const expected = fromJS({
        selectedFields: [
          { name: "field_1", order: 1 },
          { name: "field_2", order: 0 },
          { name: "field_3", order: 2 }
        ]
      });

      const action = {
        type: actions.REORDER_FIELDS,
        payload: { name: "field_2", order: 0 }
      };

      const newState = reducer(stateWithFields, action);

      expect(newState).to.deep.equal(expected);
    });

    it("should handle a fields with the same order", () => {
      const stateWithSameOrder = fromJS({
        selectedFields: [
          { name: "field_1", order: 0 },
          { name: "field_2", order: 0 },
          { name: "field_3", order: 2 }
        ]
      });

      const expected = fromJS({
        selectedFields: [
          { name: "field_1", order: 1 },
          { name: "field_2", order: 0 },
          { name: "field_3", order: 2 }
        ]
      });

      const action = {
        type: actions.REORDER_FIELDS,
        payload: { name: "field_1", order: 1 }
      };

      const newState = reducer(stateWithSameOrder, action);

      expect(newState).to.deep.equal(expected);
    });
  });
});
