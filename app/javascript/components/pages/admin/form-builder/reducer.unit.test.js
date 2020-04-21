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
});
