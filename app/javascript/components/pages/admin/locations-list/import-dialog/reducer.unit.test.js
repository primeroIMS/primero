import { fromJS } from "immutable";

import actions from "./actions";
import reducer from "./reducer";

describe("<ImportDialog /> - Reducers", () => {
  it("should handle IMPORT_LOCATIONS_STARTED", () => {
    const expected = fromJS({
      import: {
        loading: true,
        errors: false
      }
    });

    const action = {
      type: actions.IMPORT_LOCATIONS_STARTED,
      payload: true
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle IMPORT_LOCATIONS_SUCCESS", () => {
    const expected = fromJS({
      import: {
        data: [{ id: 3 }]
      }
    });

    const action = {
      type: actions.IMPORT_LOCATIONS_SUCCESS,
      payload: { data: [{ id: 3 }] }
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle IMPORT_LOCATIONS_FAILURE", () => {
    const expected = fromJS({
      import: {
        loading: false,
        errors: true
      }
    });

    const action = {
      type: actions.IMPORT_LOCATIONS_FAILURE
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle IMPORT_LOCATIONS_FINISHED", () => {
    const expected = fromJS({
      import: {
        loading: false,
        errors: false
      }
    });

    const action = {
      type: actions.IMPORT_LOCATIONS_FINISHED
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle CLEAR_IMPORT_ERRORS", () => {
    const expected = fromJS({
      import: {
        errors: []
      }
    });

    const action = {
      type: actions.CLEAR_IMPORT_ERRORS
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });
});
