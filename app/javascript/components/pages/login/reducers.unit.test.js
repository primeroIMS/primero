import { expect } from "chai";
import { fromJS } from "immutable";

import { reducers } from "./reducers";

describe("<Login /> - Reducers", () => {
  const defaultState = fromJS({});

  it("should handle LOGIN", () => {
    const expected = fromJS({
      identity_providers: [
        {name: "unicef"},
        {name: "primero"}
      ],
      use_identity_provider: true
    });

    const action = {
      type: "idp/LOGIN",
      payload: {
        data: [
          {name: "unicef"},
          {name: "primero"}
        ],
        metadata: {
          use_identity_provider: true
        }
      }
    };
    const newState = reducers.idp(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });
});
