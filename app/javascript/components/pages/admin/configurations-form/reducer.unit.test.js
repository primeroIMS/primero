import { fromJS } from "immutable";

import actions from "./actions";
import reducer from "./reducer";

describe("configurations-form/reducers.js", () => {
  it("should handle FETCH_CONFIGURATION_STARTED", () => {
    const expected = fromJS({ loading: true, errors: false, serverErrors: [] });
    const action = {
      type: actions.FETCH_CONFIGURATION_STARTED,
      payload: true
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_CONFIGURATION_FAILURE", () => {
    const expected = fromJS({ errors: true, serverErrors: ["some error"] });
    const action = {
      type: actions.FETCH_CONFIGURATION_FAILURE,
      payload: { errors: ["some error"] }
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_CONFIGURATION_SUCCESS", () => {
    const expected = fromJS({
      selectedConfiguration: { id: 3 },
      errors: false,
      serverErrors: []
    });

    const action = {
      type: actions.FETCH_CONFIGURATION_SUCCESS,
      payload: { data: { id: 3 } }
    };

    const newState = reducer(fromJS({ selectedConfiguration: {} }), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_CONFIGURATION_FINISHED", () => {
    const expected = fromJS({ loading: false });
    const action = {
      type: actions.FETCH_CONFIGURATION_FINISHED,
      payload: false
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle CLEAR_SELECTED_CONFIGURATION", () => {
    const expected = fromJS({
      selectedConfiguration: {},
      errors: false,
      serverErrors: []
    });
    const action = {
      type: actions.CLEAR_SELECTED_CONFIGURATION,
      payload: false
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SAVE_CONFIGURATION_STARTED", () => {
    const expected = fromJS({ saving: true });
    const action = {
      type: actions.SAVE_CONFIGURATION_STARTED,
      payload: true
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SAVE_CONFIGURATION_FINISHED", () => {
    const expected = fromJS({ saving: false });
    const action = {
      type: actions.SAVE_CONFIGURATION_FINISHED,
      payload: false
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SAVE_CONFIGURATION_FAILURE", () => {
    const expected = fromJS({ errors: true, serverErrors: ["some error"] });
    const action = {
      type: actions.SAVE_CONFIGURATION_FAILURE,
      payload: { errors: ["some error"] }
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle APPLY_CONFIGURATION_STARTED", () => {
    const expected = fromJS({ applying: false, loading: true, errors: false, serverErrors: [] });
    const action = {
      type: actions.APPLY_CONFIGURATION_STARTED,
      payload: true
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle APPLY_CONFIGURATION_SUCCESS", () => {
    const expected = fromJS({
      applying: true
    });

    const action = {
      type: actions.APPLY_CONFIGURATION_SUCCESS,
      payload: { data: { id: 3 } }
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("deprecated APPLY_CONFIGURATION_FINISHED", () => {
    const expected = fromJS({ loading: false });
    const action = {
      type: actions.APPLY_CONFIGURATION_FINISHED,
      payload: false
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.not.deep.equal(expected);
  });

  it("should handle APPLY_CONFIGURATION_FAILURE", () => {
    const expected = fromJS({ errors: true, serverErrors: ["some error"] });
    const action = {
      type: actions.APPLY_CONFIGURATION_FAILURE,
      payload: { errors: ["some error"] }
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle CHECK_CONFIGURATION_FINISHED", () => {
    const expected = fromJS({ applying: false, loading: false });
    const action = {
      type: actions.CHECK_CONFIGURATION_FINISHED
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SEND_TO_PRODUCTION_STARTED", () => {
    const expected = fromJS({ sending: true });
    const action = {
      type: actions.SEND_TO_PRODUCTION_STARTED,
      payload: true
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("deprecated APPLY_CONFIGURATION_FINISHED", () => {
    const expected = fromJS({ sending: false });
    const action = {
      type: actions.APPLY_CONFIGURATION_FINISHED,
      payload: false
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.not.deep.equal(expected);
  });

  it("should handle SEND_TO_PRODUCTION_FAILURE", () => {
    const expected = fromJS({ errors: true, serverErrors: ["some error"] });
    const action = {
      type: actions.SEND_TO_PRODUCTION_FAILURE,
      payload: { errors: ["some error"] }
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });
});
