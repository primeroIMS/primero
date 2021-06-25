import { fromJS } from "immutable";

import { DEFAULT_METADATA } from "../../../../config";

import actions from "./actions";
import reducer from "./reducer";

describe("<UserGroupsList /> - Reducers", () => {
  it("should handle USER_GROUPS_SUCCESS", () => {
    const expected = fromJS({
      data: [{ id: 1, unique_id: "usergroup-my-usergroup" }],
      metadata: { per: 20 }
    });

    const action = {
      type: actions.USER_GROUPS_SUCCESS,
      payload: {
        data: [{ id: 1, unique_id: "usergroup-my-usergroup" }],
        metadata: { per: 20 }
      }
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

  it("should handle SET_USER_GROUPS_FILTER", () => {
    const expected = fromJS({
      filters: fromJS({ disabled: ["true", "false"] })
    });

    const action = {
      type: actions.SET_USER_GROUPS_FILTER,
      payload: { data: { disabled: ["true", "false"] } }
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });
});
