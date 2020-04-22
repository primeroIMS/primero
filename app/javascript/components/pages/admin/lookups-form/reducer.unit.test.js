import { fromJS } from "immutable";

import actions from "./actions";
import reducers from "./reducer";

describe("<LookupForm /> - reducers", () => {
  it("should handle CLEAR_SELECTED_LOOKUP", () => {
    const expected = fromJS({
      selectedLookup: {},
      errors: false
    });
    const action = {
      type: actions.CLEAR_SELECTED_LOOKUP,
      payload: false
    };
    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_LOOKUP_FAILURE", () => {
    const expected = fromJS({ errors: true });
    const action = {
      type: actions.FETCH_LOOKUP_FAILURE,
      payload: true
    };
    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_LOOKUP_FINISHED", () => {
    const expected = fromJS({ loading: false });
    const action = {
      type: actions.FETCH_LOOKUP_FINISHED,
      payload: false
    };
    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_LOOKUP_STARTED", () => {
    const expected = fromJS({ loading: true, errors: false });
    const action = {
      type: actions.FETCH_LOOKUP_STARTED,
      payload: true
    };
    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_LOOKUP_SUCCESS", () => {
    const expected = fromJS({
      selectedLookup: { id: 3 },
      errors: false
    });

    const action = {
      type: actions.FETCH_LOOKUP_SUCCESS,
      payload: { data: { id: 3 } }
    };

    const newState = reducers(fromJS({ selectedLookup: {} }), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SAVE_LOOKUP_FAILURE", () => {
    const expected = fromJS({ errors: true });
    const action = {
      type: actions.SAVE_LOOKUP_FAILURE,
      payload: true
    };
    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SAVE_LOOKUP_FINISHED", () => {
    const expected = fromJS({ saving: false });
    const action = {
      type: actions.SAVE_LOOKUP_FINISHED,
      payload: false
    };
    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SAVE_LOOKUP_STARTED", () => {
    const expected = fromJS({ saving: true });
    const action = {
      type: actions.SAVE_LOOKUP_STARTED,
      payload: true
    };
    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });
});
