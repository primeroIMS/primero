import { fromJS } from "immutable";

import { expect } from "../../../../test/unit-test-helpers";

import actions from "./actions";
import reducers from "./reducers";

describe("<AgenciesForm /> - Reducers", () => {
  it("should handle FETCH_AGENCY_STARTED", () => {
    const expected = fromJS({ loading: true, errors: false, serverErrors: [] });
    const action = {
      type: actions.FETCH_AGENCY_STARTED,
      payload: true
    };
    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_AGENCY_FAILURE", () => {
    const expected = fromJS({ errors: true, serverErrors: ["some error"] });
    const action = {
      type: actions.FETCH_AGENCY_FAILURE,
      payload: { errors: ["some error"] }
    };
    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_AGENCY_SUCCESS", () => {
    const expected = fromJS({
      selectedAgency: { id: 3 },
      errors: false,
      serverErrors: []
    });

    const action = {
      type: actions.FETCH_AGENCY_SUCCESS,
      payload: { data: { id: 3 } }
    };

    const newState = reducers(fromJS({ selectedAgency: {} }), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_AGENCY_FINISHED", () => {
    const expected = fromJS({ loading: false });
    const action = {
      type: actions.FETCH_AGENCY_FINISHED,
      payload: false
    };
    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle CLEAR_SELECTED_AGENCY", () => {
    const expected = fromJS({
      selectedAgency: {},
      errors: false,
      serverErrors: []
    });
    const action = {
      type: actions.CLEAR_SELECTED_AGENCY,
      payload: false
    };
    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SAVE_AGENCY_STARTED", () => {
    const expected = fromJS({ saving: true });
    const action = {
      type: actions.SAVE_AGENCY_STARTED,
      payload: true
    };
    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SAVE_AGENCY_FINISHED", () => {
    const expected = fromJS({ saving: false });
    const action = {
      type: actions.SAVE_AGENCY_FINISHED,
      payload: false
    };
    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });
});
