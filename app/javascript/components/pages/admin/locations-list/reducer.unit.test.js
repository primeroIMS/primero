import { fromJS } from "immutable";

import { DEFAULT_LOCATION_METADATA } from "./constants";
import actions from "./actions";
import reducer from "./reducer";

describe("<LocationsList /> - Reducers", () => {
  it("should handle LOCATIONS_STARTED", () => {
    const expected = fromJS({
      loading: true,
      errors: false
    });

    const action = {
      type: actions.LOCATIONS_STARTED,
      payload: true
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle LOCATIONS_SUCCESS", () => {
    const expected = fromJS({
      data: [{ id: 3 }],
      metadata: { per: 20 }
    });

    const action = {
      type: actions.LOCATIONS_SUCCESS,
      payload: { data: [{ id: 3 }], metadata: { per: 20 } }
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle LOCATIONS_FAILURE", () => {
    const expected = fromJS({
      loading: false,
      errors: true
    });

    const action = {
      type: actions.LOCATIONS_FAILURE
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle LOCATIONS_FINISHED", () => {
    const expected = fromJS({
      loading: false,
      errors: false
    });

    const action = {
      type: actions.LOCATIONS_FINISHED
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle DISABLE_LOCATIONS_FAILURE", () => {
    const expected = fromJS({ disableLocations: { loading: false, errors: true } });

    const action = { type: actions.DISABLE_LOCATIONS_FAILURE };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle DISABLE_LOCATIONS_FINISHED", () => {
    const expected = fromJS({ disableLocations: { loading: false, errors: false } });

    const action = { type: actions.DISABLE_LOCATIONS_FINISHED };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle DISABLE_LOCATIONS_STARTED", () => {
    const expected = fromJS({ disableLocations: { loading: true, errors: false } });

    const action = { type: actions.DISABLE_LOCATIONS_STARTED };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle DISABLE_LOCATIONS_SUCCESS", () => {
    const expected = fromJS({ disableLocations: { loading: true, errors: false } });

    const action = { type: actions.DISABLE_LOCATIONS_SUCCESS };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle CLEAR_METADATA", () => {
    const expected = fromJS({
      metadata: DEFAULT_LOCATION_METADATA
    });

    const action = {
      type: actions.CLEAR_METADATA
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SET_LOCATIONS_FILTER", () => {
    const expected = fromJS({
      filters: fromJS({ disabled: ["true", "false"] })
    });

    const action = {
      type: actions.SET_LOCATIONS_FILTER,
      payload: { data: { disabled: ["true", "false"] } }
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });
});
