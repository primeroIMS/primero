import { fromJS } from "immutable";

import actions from "./actions";
import reducer from "./reducer";

describe("<UsersList /> - Reducers", () => {
  it("should handle USERS_SUCCESS", () => {
    const expected = fromJS({
      data: [{ id: 3 }],
      metadata: { per: 20 }
    });

    const action = {
      type: actions.USERS_SUCCESS,
      payload: { data: [{ id: 3 }], metadata: { per: 20 } }
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });
});
