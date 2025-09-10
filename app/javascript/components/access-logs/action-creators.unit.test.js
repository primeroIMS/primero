// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("AccessLogs - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    ["fetchAccessLogs"].forEach(property => {
      expect(creators).toHaveProperty(property);
      delete creators[property];
    });

    expect(Object.keys(creators)).toHaveLength(0);
  });

  it("should check the 'fetchAccessLogs' action creator to return the correct object", () => {
    const recordType = "cases";
    const record = "d6a6dbb4-e5e9-4720-a661-e181a12fd3a0";

    const action = actionCreators.fetchAccessLogs(recordType, record);

    expect(action.type).toEqual(actions.FETCH_ACCESS_LOGS);
    expect(action.api.path).toEqual(`${recordType}/${record}/access_log`);
  });
});
