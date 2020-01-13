import { expect } from "../../../../test/unit-test-helpers";
import { RECORD_PATH } from "../../../../config";

import * as actionsCreators from "./action-creators";
import actions from "./actions";

describe("<UsersList /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionsCreators };

    ["fetchUsers"].forEach(property => {
      expect(creators).to.have.property(property);
      delete creators[property];
    });

    expect(creators).to.be.empty;
  });

  it("should check that 'fetchUser' action creator returns the correct object", () => {
    const expectedAction = {
      type: actions.FETCH_USER,
      api: {
        path: `${RECORD_PATH.users}/10`
      }
    };

    expect(actionsCreators.fetchUser(10)).to.deep.equal(expectedAction);
  });
});
