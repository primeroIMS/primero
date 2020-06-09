import { fromJS } from "immutable";

import actions from "./actions";
import reducer from "./reducer";

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
      saving: true,
      errors: false,
      serverErrors: [],
      updatedFormIds: []
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

  it("should handle SAVE_FORM_SUCCESS", () => {
    const expected = fromJS({ updatedFormIds: [1, 2, 3] });

    const action = {
      type: actions.SAVE_FORM_SUCCESS,
      payload: [
        { ok: true, json: { data: { id: 1 } } },
        { ok: true, json: { data: { id: 2 } } },
        { ok: true, json: { data: { id: 3 } } }
      ]
    };

    const newState = reducer(initialState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SET_SELECTED_FIELD", () => {
    const selectedField = fromJS({ id: 1, name: "field_1" });
    const action = {
      type: actions.SET_SELECTED_FIELD,
      payload: { name: "field_1" }
    };

    const currentState = fromJS({ selectedFields: [selectedField] });
    const expected = fromJS({ selectedFields: [selectedField], selectedField });

    const newState = reducer(currentState, action);

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

    it("should handle fields with the same order", () => {
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

  describe("SET_SELECTED_SUBFORM", () => {
    const selectedSubformField = {
      id: 4,
      unique_id: "form_4",
      fields: [
        { id: 1, name: "field_1" },
        { id: 4, name: "field_4" }
      ]
    };
    const stateWithData = fromJS({
      formSections: {
        "1": { id: 1, unique_id: "form_1", fields: [1, 2] },
        "2": { id: 2, unique_id: "form_2", fields: [2, 3] },
        "3": { id: 3, unique_id: "form_3", fields: [1, 3] }
      },
      fields: {
        "1": { id: 1, name: "field_1" },
        "2": { id: 2, name: "field_2" },
        "3": { id: 3, name: "field_3" }
      },
      selectedSubforms: [selectedSubformField]
    });

    describe("when there are no selected subforms", () => {
      it("returns and add the selected subform", () => {
        const expected = fromJS({
          id: 1,
          unique_id: "form_1",
          fields: [
            { id: 1, name: "field_1" },
            { id: 2, name: "field_2" }
          ]
        });
        const action = {
          type: actions.SET_SELECTED_SUBFORM,
          payload: { id: 1 }
        };

        const newState = reducer(stateWithData, action);

        expect(newState.get("selectedFieldSubform")).to.deep.equal(expected);
        expect(newState.get("selectedSubforms")).to.deep.equal(
          fromJS([selectedSubformField, expected])
        );
      });
    });

    describe("when there are selected subforms", () => {
      it("returns the selected subform it is not added to the array", () => {
        const expected = fromJS(selectedSubformField);
        const action = {
          type: actions.SET_SELECTED_SUBFORM,
          payload: { id: 4 }
        };

        const newState = reducer(stateWithData, action);

        expect(newState.get("selectedFieldSubform")).to.deep.equal(expected);
        expect(newState.get("selectedSubforms")).to.deep.equal(
          fromJS([expected])
        );
      });
    });
  });

  describe("UPDATE_SELECTED_FIELD", () => {
    it("updates the field properties", () => {
      const expected = fromJS({
        selectedFields: [
          { id: "1", name: "field_1", display_name: { en: "Updated Field 1" } },
          { id: "2", name: "field_2", display_name: { en: "Field 2" } }
        ]
      });
      const currentState = fromJS({
        selectedFields: [
          { id: "1", name: "field_1", display_name: { en: "Field 1" } },
          { id: "2", name: "field_2", display_name: { en: "Field 2" } }
        ]
      });
      const action = {
        type: actions.UPDATE_SELECTED_FIELD,
        payload: {
          data: { field_1: { display_name: { en: "Updated Field 1" } } }
        }
      };

      const newState = reducer(currentState, action);

      expect(newState).to.deep.equal(expected);
    });
  });

  describe("UPDATE_SELECTED_SUBFORM", () => {
    it("updates the subform properties and fields", () => {
      const selectedFieldSubform = {
        id: 1,
        unique_id: "form_1",
        name: { en: "Form Section 1" },
        fields: [
          { id: 1, name: "field_1", display_name: { en: "Field 1" } },
          { id: 2, name: "field_2", display_name: { en: "Field 2" } }
        ]
      };

      const expected = fromJS({
        selectedSubforms: [
          {
            ...selectedFieldSubform,
            name: { en: "Updated Form Section 1 " },
            fields: [
              {
                id: 1,
                name: "field_1",
                display_name: { en: "Updated Field 1" }
              },
              { id: 2, name: "field_2", display_name: { en: "Field 2" } }
            ]
          }
        ],
        selectedFieldSubform
      });

      const currentState = fromJS({
        selectedSubforms: [selectedFieldSubform],
        selectedFieldSubform
      });

      const action = {
        type: actions.UPDATE_SELECTED_SUBFORM,
        payload: {
          data: {
            id: 1,
            unique_id: "form_1",
            name: { en: "Updated Form Section 1 " },
            fields: {
              field_1: {
                id: 1,
                name: "field_1",
                display_name: { en: "Updated Field 1" }
              }
            }
          }
        }
      };

      const newState = reducer(currentState, action);

      expect(newState).to.deep.equal(expected);
    });
  });
});
