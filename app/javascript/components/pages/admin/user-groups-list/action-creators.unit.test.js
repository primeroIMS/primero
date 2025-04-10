// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("<UserGroupsList /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    ["fetchUserGroups", "setUserGroupsFilter"].forEach(property => {
      expect(creators).toHaveProperty(property);
      delete creators[property];
    });

    expect(Object.keys(creators)).toHaveLength(0);
  });

  it("should check fetchUserGroups return the correct object", () => {
    const data = { per: 1, managed: true };

    const expectedAction = {
      type: actions.USER_GROUPS,
      api: {
        params: data,
        path: "user_groups"
      }
    };

    expect(actionCreators.fetchUserGroups({ data })).toEqual(expectedAction);
  });

  it("should check that 'setUserGroupsFilter' action creator returns the correct object", () => {
    const payload = { data: { disabled: ["true", "false"] } };
    const expectedAction = {
      type: actions.SET_USER_GROUPS_FILTER,
      payload
    };

    expect(actionCreators.setUserGroupsFilter(payload)).toEqual(expectedAction);
  });
});
