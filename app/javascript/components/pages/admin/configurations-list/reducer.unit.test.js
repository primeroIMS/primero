import { fromJS } from "immutable";

import { DEFAULT_METADATA } from "../../../../config";

import actions from "./actions";
import reducer from "./reducer";

describe("configurations-list/reducers.js", () => {
  it("should handle FETCH_CONFIGURATIONS_STARTED", () => {
    const expected = fromJS({
      loading: true,
      errors: false
    });

    const action = {
      type: actions.FETCH_CONFIGURATIONS_STARTED
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_CONFIGURATIONS_SUCCESS", () => {
    const payload = {
      data: [
        {
          id: "ac3d041c-1592-4f99-8191-b38fbe448735",
          name: "SWIMS - 20200903",
          description: "September 2020 baseline",
          version: "20200826.113513.25bf89a",
          created_on: "2020-08-26T15:35:13.720Z",
          created_by: "primero_swims_admin",
          applied_on: null,
          applied_by: null
        }
      ],
      metadata: {
        total: 1,
        per: 20,
        page: 1
      }
    };

    const expected = fromJS(payload);

    const action = {
      type: actions.FETCH_CONFIGURATIONS_SUCCESS,
      payload
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_CONFIGURATIONS_FAILURE", () => {
    const expected = fromJS({
      loading: false,
      errors: true
    });

    const action = {
      type: actions.FETCH_CONFIGURATIONS_FAILURE
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_CONFIGURATIONS_FINISHED", () => {
    const expected = fromJS({
      loading: false,
      errors: false
    });

    const action = {
      type: actions.FETCH_CONFIGURATIONS_FINISHED
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle CLEAR_METADATA", () => {
    const expected = fromJS({
      metadata: DEFAULT_METADATA
    });

    const action = {
      type: actions.CLEAR_METADATA
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });
});
