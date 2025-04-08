// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { RECORD_PATH } from "../../../../config";

import * as actionsCreators from "./action-creators";
import actions from "./actions";

describe("<UsersList /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionsCreators };

    ["fetchUsers", "setUsersFilters"].forEach(property => {
      expect(creators).toHaveProperty(property);
      delete creators[property];
    });

    expect(Object.keys(creators)).toHaveLength(0);
  });

  it("should check that 'fetchUsers' action creator returns the correct object", () => {
    const expectedAction = {
      type: actions.USERS,
      api: {
        params: undefined,
        path: RECORD_PATH.users
      }
    };

    expect(actionsCreators.fetchUsers()).toEqual(expectedAction);
  });

  it("should check that 'setUsersFilters' action creator returns the correct object", () => {
    const payload = {
      user_name: "test"
    };

    const expected = {
      type: actions.SET_USERS_FILTER,
      payload
    };

    expect(actionsCreators.setUsersFilters(payload)).toEqual(expected);
  });
});
