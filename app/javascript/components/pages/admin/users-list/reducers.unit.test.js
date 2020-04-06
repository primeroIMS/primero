import { fromJS } from "immutable";

import { expect } from "../../../../test";

import actions from "./actions";
import reducers from "./reducers";

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

    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });
});
