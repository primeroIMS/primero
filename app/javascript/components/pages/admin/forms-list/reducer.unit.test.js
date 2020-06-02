import { Map, fromJS } from "immutable";

import { mapEntriesToRecord } from "../../../../libs";
import { normalizeFormData } from "../../../../schemas";
import { FormSectionRecord, FieldRecord } from "../../../record-form/records";

import actions from "./actions";
import reducer from "./reducer";

describe("<FormsList /> - Reducers", () => {
  const initialState = Map({
    formSections: Map({}),
    fields: Map({})
  });

  it.skip("should handle RECORD_FORMS_SUCCESS", () => {
    const fields = [
      {
        id: 1,
        name: "name_first"
      }
    ];

    const formSections = [
      {
        id: 62,
        unique_id: "basic_identity",
        fields
      }
    ];

    const {
      fields: normalizedFields,
      formSections: normalizedFormSections
    } = normalizeFormData(formSections).entities;

    const expectedState = Map({
      formSections: mapEntriesToRecord(
        normalizedFormSections,
        FormSectionRecord,
        true
      ),
      fields: mapEntriesToRecord(normalizedFields, FieldRecord, true)
    });

    const action = {
      type: actions.RECORD_FORMS_SUCCESS,
      payload: {
        data: formSections
      }
    };

    const newState = reducer(initialState, action);

    expect(newState).to.deep.equal(expectedState);
  });

  it("should handle RECORD_FORMS_STARTED", () => {
    const expected = Map({
      formSections: Map({}),
      fields: Map({}),
      errors: false,
      loading: true
    });

    const action = {
      type: actions.RECORD_FORMS_STARTED
    };

    const newState = reducer(initialState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle RECORD_FORMS_FINISHED", () => {
    const expected = Map({
      formSections: Map({}),
      fields: Map({}),
      loading: false
    });

    const action = {
      type: actions.RECORD_FORMS_FINISHED
    };

    const newState = reducer(initialState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle CLEAR_FORMS_REORDER", () => {
    const currentState = fromJS({
      reorderedForms: {
        pending: [1, 2, 3]
      }
    });

    const expected = fromJS({
      reorderedForms: {}
    });

    const action = {
      type: actions.CLEAR_FORMS_REORDER
    };

    const newState = reducer(currentState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle ENABLE_REORDER", () => {
    const currentState = fromJS({
      reorderedForms: {}
    });

    const expected = fromJS({
      reorderedForms: { enabled: true }
    });

    const action = {
      type: actions.ENABLE_REORDER,
      payload: true
    };

    const newState = reducer(currentState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle REORDER_FORM_GROUPS", () => {
    const currentState = fromJS({
      formSections: {
        "1": FormSectionRecord({
          id: 1,
          form_group_id: "group-2",
          order_form_group: 10,
          parent_form: "parent",
          module_ids: ["module-1"]
        }),
        "2": FormSectionRecord({
          id: 2,
          form_group_id: "group-1",
          order_form_group: 20,
          parent_form: "parent",
          module_ids: ["module-1"]
        })
      }
    });

    const action = {
      type: actions.REORDER_FORM_GROUPS,
      payload: {
        filter: {
          primeroModule: "module-1",
          recordType: "parent"
        },
        formGroupId: "group-1",
        order: 10
      }
    };

    const newState = reducer(currentState, action);

    const reordered = newState
      .get("formSections")
      .valueSeq()
      .map(form => ({
        order_form_group: form.order_form_group,
        id: form.id
      }))
      .toJS();

    expect(reordered).to.deep.equal([
      { id: 1, order_form_group: 0 },
      { id: 2, order_form_group: 10 }
    ]);
  });

  it("should handle REORDER_FORM_SECTIONS", () => {
    const currentState = fromJS({
      formSections: {
        "1": FormSectionRecord({
          id: 1,
          unique_id: "form-1",
          form_group_id: "group-1",
          order: 10,
          parent_form: "parent",
          module_ids: ["module-1"]
        }),
        "2": FormSectionRecord({
          id: 2,
          unique_id: "form-2",
          form_group_id: "group-1",
          order: 20,
          parent_form: "parent",
          module_ids: ["module-1"]
        })
      }
    });

    const action = {
      type: actions.REORDER_FORM_SECTIONS,
      payload: {
        filter: {
          primeroModule: "module-1",
          recordType: "parent"
        },
        id: "form-2",
        order: 10
      }
    };

    const newState = reducer(currentState, action);

    const reordered = newState
      .get("formSections")
      .valueSeq()
      .map(form => ({
        order: form.order,
        id: form.id
      }))
      .toJS();

    expect(reordered).to.deep.equal([
      { id: 1, order: 0 },
      { id: 2, order: 10 }
    ]);
  });

  it("should handle SAVE_FORMS_REORDER_STARTED", () => {
    const currentState = fromJS({
      reorderedForms: {}
    });

    const expected = fromJS({
      reorderedForms: { loading: true }
    });

    const action = {
      type: actions.SAVE_FORMS_REORDER_STARTED
    };

    const newState = reducer(currentState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SAVE_FORMS_REORDER_SUCCESS", () => {
    const currentState = fromJS({
      reorderedForms: {
        pending: [1, 2, 3, 4, 5]
      }
    });

    const expected = fromJS({
      reorderedForms: { pending: [4, 5], errors: [] }
    });

    const action = {
      type: actions.SAVE_FORMS_REORDER_SUCCESS,
      payload: [
        {
          ok: true,
          json: { data: { id: 1 } }
        },
        {
          ok: true,
          json: { data: { id: 2 } }
        },
        {
          ok: true,
          json: { data: { id: 3 } }
        }
      ]
    };

    const newState = reducer(currentState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SAVE_FORMS_REORDER_FINISHED", () => {
    const currentState = fromJS({
      reorderedForms: {}
    });

    const expected = fromJS({
      reorderedForms: { loading: false, finished: true }
    });

    const action = {
      type: actions.SAVE_FORMS_REORDER_FINISHED,
      payload: false
    };

    const newState = reducer(currentState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SET_REORDERED_FORMS", () => {
    const currentState = fromJS({
      reorderedForms: {}
    });

    const expected = fromJS({
      reorderedForms: { pending: [1, 2, 3] }
    });

    const action = {
      type: actions.SET_REORDERED_FORMS,
      payload: { ids: [1, 2, 3] }
    };

    const newState = reducer(currentState, action);

    expect(newState).to.deep.equal(expected);
  });
});
