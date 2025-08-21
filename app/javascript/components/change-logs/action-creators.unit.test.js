// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as actionCreators from "./action-creators";
import actions from "./actions";
import { PER_PAGE, FIRST_PAGE_RESULTS } from "./constants";

describe("ChangeLogs - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    ["fetchChangeLogs"].forEach(property => {
      expect(creators).toHaveProperty(property);
      delete creators[property];
    });

    expect(Object.keys(creators)).toHaveLength(0);
  });

  it("should check the 'fetchChangeLogs' action creator to return the correct object", () => {
    const recordType = "cases";
    const record = "d6a6dbb4-e5e9-4720-a661-e181a12fd3a0";

    const action = actionCreators.fetchChangeLogs(recordType, record);

    expect(action.type).toEqual(actions.FETCH_CHANGE_LOGS);
    expect(action.api.path).toEqual(`${recordType}/${record}/record_history`);
    expect(action.api.params).toEqual({ per: PER_PAGE, page: FIRST_PAGE_RESULTS, filters: {} });
  });
});
