import { fromJS } from "immutable";

import { expect } from "../../../../test/unit-test-helpers";

import actions from "./actions";
import reducer from "./reducer";

describe("<LookupsList /> - pages/admin/lookups-list/reducer", () => {
  it("should handle FETCH_LOOKUPS_STARTED", () => {
    const expected = fromJS({
      loading: true,
      errors: false
    });

    const action = {
      type: actions.FETCH_LOOKUPS_STARTED,
      payload: true
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_LOOKUPS_SUCCESS", () => {
    const expected = fromJS({
      data: [{ id: 3 }],
      metadata: { per: 20 }
    });

    const action = {
      type: actions.FETCH_LOOKUPS_SUCCESS,
      payload: { data: [{ id: 3 }], metadata: { per: 20 } }
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_LOOKUPS_FAILURE", () => {
    const expected = fromJS({
      loading: false,
      errors: true
    });

    const action = {
      type: actions.FETCH_LOOKUPS_FAILURE
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_LOOKUPS_FINISHED", () => {
    const expected = fromJS({
      loading: false,
      errors: false
    });

    const action = {
      type: actions.FETCH_LOOKUPS_FINISHED
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });
});
