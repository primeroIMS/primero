import { fromJS } from "immutable";

import actions from "./actions";
import reducers from "./reducers";

describe("<RolesList /> - Reducers", () => {
  it("should handle ROLES_STARTED", () => {
    const expected = fromJS({
      loading: true,
      errors: false
    });

    const action = {
      type: actions.ROLES_STARTED,
      payload: true
    };

    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle ROLES_SUCCESS", () => {
    const expected = fromJS({
      data: [{ id: 3 }],
      metadata: { per: 20 }
    });

    const action = {
      type: actions.ROLES_SUCCESS,
      payload: { data: [{ id: 3 }], metadata: { per: 20 } }
    };

    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle ROLES_FAILURE", () => {
    const expected = fromJS({
      loading: false,
      errors: true
    });

    const action = {
      type: actions.ROLES_FAILURE
    };

    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle ROLES_FINISHED", () => {
    const expected = fromJS({
      loading: false,
      errors: false
    });

    const action = {
      type: actions.ROLES_FINISHED
    };

    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });
});
