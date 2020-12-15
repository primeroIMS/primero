import { RECORD_PATH } from "../../../../config";

import * as actionsCreators from "./action-creators";
import actions from "./actions";

describe("<UsersList /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionsCreators };

    ["fetchUsers", "setUsersFilters"].forEach(property => {
      expect(creators).to.have.property(property);
      delete creators[property];
    });

    expect(creators).to.be.empty;
  });

  it("should check that 'fetchUsers' action creator returns the correct object", () => {
    const expectedAction = {
      type: actions.USERS,
      api: {
        params: undefined,
        path: RECORD_PATH.users
      }
    };

    expect(actionsCreators.fetchUsers()).to.deep.equal(expectedAction);
  });

  it("should check that 'setUsersFilters' action creator returns the correct object", () => {
    const payload = {
      user_name: "test"
    };

    const expected = {
      type: actions.SET_USERS_FILTER,
      payload
    };

    expect(actionsCreators.setUsersFilters(payload)).to.deep.equal(expected);
  });
});
