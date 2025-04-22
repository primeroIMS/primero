// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import clone from "lodash/clone";
import configureStore from "redux-mock-store";

import { CLEAR_DIALOG } from "../../action-dialog";
import { METHODS, RECORD_PATH } from "../../../config";

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("bulk-transitons - Action Creators", () => {
  const store = configureStore()({});
  const dispatch = jest.spyOn(store, "dispatch");

  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    ["saveBulkAssignedUser", "removeBulkAssignMessages"].forEach(property => {
      expect(creators).toHaveProperty(property);
      expect(creators[property]).toBeInstanceOf(Function);
      delete creators[property];
    });

    expect(Object.keys(creators)).toHaveLength(0);
  });

  it("should check the 'saveBulkAssignedUser' action creator to return the correct object", () => {
    const body = {
      data: {
        trasitioned_to: "primero_cp",
        notes: "Some notes",
        recordsIds: [12345, 67890]
      }
    };

    const expected = {
      type: `${RECORD_PATH.cases}/${actions.BULK_ASSIGN_USER_SAVE}`,
      api: {
        body,
        method: METHODS.POST,
        path: actions.BULK_ASSIGN_CASES,
        successCallback: [
          {
            action: CLEAR_DIALOG
          },
          {
            action: `${RECORD_PATH.cases}/${actions.BULK_ASSIGN_USER_SELECTED_RECORDS_LENGTH}`,
            payload: {
              selectedRecordsLength: 2
            }
          }
        ]
      }
    };

    expect(dispatch(actionCreators.saveBulkAssignedUser(RECORD_PATH.cases, [12345, 67890], 2, body))).toEqual(expected);
  });

  it("should check the 'removeBulkAssignMessages' action creator to remove all the bulk assign", () => {
    const expected = {
      type: `${RECORD_PATH.cases}/${actions.CLEAR_BULK_ASSIGN_MESSAGES}`
    };

    expect(dispatch(actionCreators.removeBulkAssignMessages(RECORD_PATH.cases))).toEqual(expected);
  });
});
