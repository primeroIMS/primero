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
      serverErrors: [],
      selectedFields: []
    });

    const action = {
      type: actions.CLEAR_SELECTED_FORM
    };

    const newState = reducer(initialState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle CLEAR_SELECTED_SUBFORM", () => {
    const stateWithSubform = fromJS({
      selectedSubform: { id: 1, unique_id: "subform_1" }
    });

    const expected = fromJS({});

    const action = {
      type: actions.CLEAR_SELECTED_SUBFORM
    };

    const newState = reducer(stateWithSubform, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle CLEAR_SELECTED_FIELD", () => {
    const stateWithField = fromJS({
      selectedField: { id: 1, name: "field_1" }
    });

    const expected = fromJS({});

    const action = {
      type: actions.CLEAR_SELECTED_FIELD
    };

    const newState = reducer(stateWithField, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle CLEAR_SELECTED_SUBFORM_FIELD", () => {
    const stateWithSubformField = fromJS({
      selectedSubformField: { id: 1, name: "subform_field_1" }
    });

    const expected = fromJS({});

    const action = {
      type: actions.CLEAR_SELECTED_SUBFORM_FIELD
    };

    const newState = reducer(stateWithSubformField, action);

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
    const initialStateCreateField = fromJS({ selectedFields: [] });
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
    const selectedSubform = {
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
      subforms: [selectedSubform]
    });

    describe("when there are no selected subforms", () => {
      it("returns and add the selected subform", () => {
        const expected = fromJS({
          id: 1,
          unique_id: "form_1",
          fields: [
            { id: 1, name: "field_1", on_collapsed_subform: false },
            { id: 2, name: "field_2", on_collapsed_subform: false }
          ]
        });
        const action = {
          type: actions.SET_SELECTED_SUBFORM,
          payload: { id: 1 }
        };

        const newState = reducer(stateWithData, action);

        expect(newState.get("selectedSubform")).to.deep.equal(expected);
        expect(newState.get("subforms")).to.deep.equal(
          fromJS([selectedSubform, expected])
        );
      });
    });

    describe("when there are selected subforms", () => {
      it("returns the selected subform it is not added to the array", () => {
        const expected = fromJS(selectedSubform);
        const action = {
          type: actions.SET_SELECTED_SUBFORM,
          payload: { id: 4 }
        };

        const newState = reducer(stateWithData, action);

        expect(newState.get("selectedSubform")).to.deep.equal(expected);
        expect(newState.get("subforms")).to.deep.equal(fromJS([expected]));
      });
    });
  });

  describe("SET_SELECTED_SUBFORM_FIELD", () => {
    const field2 = { id: 2, name: "field_2" };
    const stateWithData = fromJS({
      selectedSubform: {
        id: 1,
        unique_id: "form_1",
        fields: [{ id: 1, name: "field_1" }, field2]
      }
    });

    it("returns the correct subform field", () => {
      const action = {
        type: actions.SET_SELECTED_SUBFORM_FIELD,
        payload: { name: "field_2" }
      };

      const newState = reducer(stateWithData, action);

      expect(newState.get("selectedSubformField")).to.deep.equal(
        fromJS(field2)
      );
    });
  });

  describe("UPDATE_SELECTED_FIELD", () => {
    it("updates the field properties", () => {
      const expected = fromJS({
        selectedFields: [
          { id: "1", name: "field_1", display_name: { en: "Updated Field 1" } },
          { id: "2", name: "field_2", display_name: { en: "Field 2" } }
        ],
        selectedField: {
          id: "1",
          name: "field_1",
          display_name: { en: "Updated Field 1" }
        }
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
    const selectedSubform = {
      id: 1,
      unique_id: "form_1",
      name: { en: "Form Section 1" },
      fields: [
        { id: 1, name: "field_1", display_name: { en: "Field 1" } },
        { id: 2, name: "field_2", display_name: { en: "Field 2" } }
      ],
      collapsed_field_names: []
    };

    const updatedSubform = {
      ...selectedSubform,
      name: { en: "Updated Form Section 1 " },
      fields: [
        {
          id: 1,
          name: "field_1",
          display_name: { en: "Updated Field 1" }
        },
        { id: 2, name: "field_2", display_name: { en: "Field 2" } }
      ]
    };

    it("updates the subform properties and fields", () => {
      const expected = fromJS({
        subforms: [updatedSubform],
        selectedSubform: updatedSubform
      });

      const currentState = fromJS({
        subforms: [selectedSubform],
        selectedSubform
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

    it("updates the collapsed_field_names", () => {
      const expectedSubform = {
        ...updatedSubform,
        fields: [
          {
            id: 1,
            name: "field_1",
            display_name: { en: "Updated Field 1" },
            on_collapsed_subform: true
          },
          { id: 2, name: "field_2", display_name: { en: "Field 2" } }
        ],
        collapsed_field_names: ["field_1"]
      };

      const expected = fromJS({
        subforms: [expectedSubform],
        selectedSubform: expectedSubform
      });

      const currentState = fromJS({
        subforms: [selectedSubform],
        selectedSubform
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
                display_name: { en: "Updated Field 1" },
                on_collapsed_subform: true
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
