// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { TransitionRecord } from "../../../transitions/records";

import reducer from "./reducer";
import actions from "./actions";

describe("<Transitions /> - Reducers", () => {
  const initialState = fromJS({
    data: []
  });

  it("should handle TRANSFER_REQUEST_FAILURE", () => {
    const payload = {
      errors: [
        {
          status: 403,
          resource: "/api/v2/cases/transfer_requests",
          message: "Forbidden"
        }
      ]
    };
    const expected = fromJS({
      data: [],
      transferRequest: {
        errors: true,
        loading: false
      }
    });
    const action = {
      type: actions.TRANSFER_REQUEST_FAILURE,
      payload
    };

    const newState = reducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle TRANSFER_REQUEST_FINISHED", () => {
    const expected = fromJS({
      data: [],
      transferRequest: {
        loading: false
      }
    });
    const action = {
      type: actions.TRANSFER_REQUEST_FINISHED,
      payload: false
    };

    const newState = reducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle TRANSFER_REQUEST_STARTED", () => {
    const expected = fromJS({
      data: [],
      transferRequest: {
        errors: false,
        loading: true
      }
    });
    const action = {
      type: actions.TRANSFER_REQUEST_STARTED,
      payload: true
    };

    const newState = reducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle TRANSFER_REQUEST_SUCCESS", () => {
    const payload = {
      data: {
        id: "b46a12df-4db4-451c-98ff-c6301b90bf51",
        type: "Transitions",
        record_id: "2a560934-39fd-4d5b-aedb-93e90f5df706",
        record_type: "case",
        transitioned_to: "primero_mgr_cp",
        transitioned_by: "primero",
        notes: "Test notes",
        created_at: "2019-10-23T19:39:14.930Z",
        consent_overridden: false,
        consent_individual_transfer: false,
        rejected_reason: "",
        status: "done"
      }
    };
    const expected = fromJS({
      data: [TransitionRecord(payload.data)],
      transferRequest: {
        errors: false,
        message: []
      }
    });
    const action = {
      type: actions.TRANSFER_REQUEST_SUCCESS,
      payload
    };

    const newState = reducer(initialState, action);

    expect(newState).toEqual(expected);
  });
});
