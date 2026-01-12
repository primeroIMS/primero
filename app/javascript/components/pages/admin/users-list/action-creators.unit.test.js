// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { METHODS, RECORD_PATH } from "../../../../config";

import * as actionsCreators from "./action-creators";
import actions from "./actions";

describe("<UsersList /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionsCreators };

    ["fetchUsers", "setUsersFilters", "disableUsers"].forEach(property => {
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

  it("should check that 'disableUsers' action creator returns the correct object", () => {
    const filters = fromJS({ id: ["1", "2"] });
    const currentFilters = fromJS({ page: 1, per: 20 });
    const message = "Users disabled successfully";

    const result = actionsCreators.disableUsers({ filters, currentFilters, message });

    expect(result.type).toEqual(actions.DISABLE_USERS);
    expect(result.api.method).toEqual(METHODS.POST);
    expect(result.api.path).toEqual(`${RECORD_PATH.users}/update_bulk`);
    expect(result.api.body).toEqual({ data: filters.toJS() });
    expect(result.api.successCallback).toHaveLength(3);
  });
});
