// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { RECORD_PATH } from "../../config";

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("<ActivityLog/> - Action Creators", () => {
  it("should check the 'fetchActivityLog' action creator to return the correct object", () => {
    const expected = {
      type: actions.FECTH_ACTIVITY_LOGS,
      api: {
        path: RECORD_PATH.activity_log,
        params: {}
      }
    };

    expect(actionCreators.fetchActivityLog()).toEqual(expected);
  });

  it("should check the 'setActivityLogsFilter' action creator to return the correct object", () => {
    const expected = {
      type: actions.SET_ACTIVITY_LOGS_FILTER,
      payload: { data: { filter1: "value1" } }
    };

    expect(actionCreators.setActivityLogsFilter({ data: { filter1: "value1" } })).toEqual(expected);
  });
});
