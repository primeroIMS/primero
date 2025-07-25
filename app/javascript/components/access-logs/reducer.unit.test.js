// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { listEntriesToRecord } from "../../libs";

import { AccessLogsRecord } from "./records";
import reducer from "./reducer";
import actions from "./actions";

describe("ChangeLogs - Reducers", () => {
  const nsReducer = reducer.accessLogs;
  const defaultState = fromJS({
    data: []
  });

  it("should handle FETCH_ACCESS_LOGS_SUCCESS", () => {
    const payload = {
      metadata: { page: 1, total: 2 },
      data: [
        {
          record_id: "38c82975-99aa-4798-9c3d-dabea104d992",
          record_type: "cases",
          timestamp: "2020-08-11T10:27:33Z",
          user_name: "primero",
          full_name: "SuperUser",
          action: "update",
          role_name: "My Role"
        },
        {
          record_id: "38c82975-99aa-4798-9c3d-dabea104d992",
          record_type: "cases",
          timestamp: "2020-08-10T18:27:33Z",
          user_name: "primero",
          full_name: "SuperUser",
          action: "show",
          role_name: "My Role"
        }
      ]
    };
    const expected = fromJS({
      data: listEntriesToRecord(payload.data, AccessLogsRecord),
      errors: false,
      metadata: fromJS({ page: 1, total: 2 })
    });
    const action = {
      type: actions.FETCH_ACCESS_LOGS_SUCCESS,
      payload: {
        metadata: { page: 1, total: 2 },
        data: payload.data
      }
    };
    const newState = nsReducer(defaultState, action);

    expect(newState).toEqual(expected);
  });
});
