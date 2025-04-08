// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { RECORD_PATH } from "../../../config";

import reducer from "./reducer";
import actions from "./actions";

describe("bulk-transitons - Reducers", () => {
  const defaultState = fromJS({
    bulkTransitions: {}
  });

  it("should handle BULK_ASSIGN_USER_SAVE_FAILURE", () => {
    const payload = {
      errors: [
        {
          status: 422,
          resource: "/api/v2/cases/123abc/assigns",
          detail: "transitioned_to",
          message: ["transition.errors.to_user_can_receive"]
        }
      ]
    };
    const expected = fromJS({
      bulkTransitions: {
        loading: false
      }
    });
    const action = {
      type: `${RECORD_PATH.cases}/${actions.BULK_ASSIGN_USER_SAVE_FAILURE}`,
      payload
    };

    const newState = reducer(RECORD_PATH.cases)(defaultState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle BULK_ASSIGN_USER_SAVE_FINISHED", () => {
    const expected = fromJS({
      bulkTransitions: {
        loading: false
      }
    });
    const action = {
      type: `${RECORD_PATH.cases}/${actions.BULK_ASSIGN_USER_SAVE_FINISHED}`,
      payload: false
    };

    const newState = reducer(RECORD_PATH.cases)(defaultState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle BULK_ASSIGN_USER_SAVE_STARTED", () => {
    const expected = fromJS({
      bulkTransitions: {
        loading: true,
        data: [],
        errors: []
      }
    });
    const action = {
      type: `${RECORD_PATH.cases}/${actions.BULK_ASSIGN_USER_SAVE_STARTED}`,
      payload: true
    };

    const newState = reducer(RECORD_PATH.cases)(defaultState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle BULK_ASSIGN_USER_SAVE_SUCCESS", () => {
    const payload = {
      data: {
        transitioned_to: "user_sample",
        filters: {
          short_id: ["fbd6839", "a6e9170"]
        }
      },
      errors: [
        {
          status: 500,
          resource: "/api/v2/cases/assigns",
          message: "StandardError"
        }
      ]
    };
    const expected = fromJS({
      bulkTransitions: {
        data: {
          transitioned_to: "user_sample",
          filters: {
            short_id: ["fbd6839", "a6e9170"]
          }
        },
        errors: [
          {
            status: 500,
            resource: "/api/v2/cases/assigns",
            message: "StandardError"
          }
        ]
      }
    });
    const action = {
      type: `${RECORD_PATH.cases}/${actions.BULK_ASSIGN_USER_SAVE_SUCCESS}`,
      payload
    };

    const newState = reducer(RECORD_PATH.cases)(defaultState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle BULK_ASSIGN_USER_SELECTED_RECORDS_LENGTH", () => {
    const expected = fromJS({
      bulkTransitions: {
        selectedRecordsLength: 4
      }
    });
    const action = {
      type: `${RECORD_PATH.cases}/${actions.BULK_ASSIGN_USER_SELECTED_RECORDS_LENGTH}`,
      payload: {
        selectedRecordsLength: 4
      }
    };

    const newState = reducer(RECORD_PATH.cases)(defaultState, action);

    expect(newState).toEqual(expected);
  });
});
