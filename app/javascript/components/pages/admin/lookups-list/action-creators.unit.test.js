// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { RECORD_PATH } from "../../../../config";

import * as actionsCreators from "./action-creators";
import actions from "./actions";

describe("<LookupsList /> - pages/admin/lookups-list/action-creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionsCreators };

    ["fetchAdminLookups", "setLookupsFilter"].forEach(property => {
      expect(creators).toHaveProperty(property);
      delete creators[property];
    });

    expect(Object.keys(creators)).toHaveLength(0);
  });

  it("should check that 'fetchAdminLookups' action creator returns the correct object", () => {
    const expected = {
      type: actions.FETCH_LOOKUPS,
      api: {
        params: undefined,
        path: RECORD_PATH.lookups
      }
    };

    expect(actionsCreators.fetchAdminLookups()).toEqual(expected);
  });

  it("should check that 'setLookupsFilter' action creator returns the correct object", () => {
    const payload = { data: { disabled: ["true", "false"] } };
    const expectedAction = {
      type: actions.SET_LOOKUPS_FILTER,
      payload
    };

    expect(actionsCreators.setLookupsFilter(payload)).toEqual(expectedAction);
  });
});
