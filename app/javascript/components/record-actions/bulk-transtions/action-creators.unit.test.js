import clone from "lodash/clone";
import configureStore from "redux-mock-store";
import sinon from "sinon";

import { ASSIGN_DIALOG } from "../constants";
import { SET_DIALOG, SET_DIALOG_PENDING } from "../actions";
import { METHODS, RECORD_PATH } from "../../../config";

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("bulk-transitons - Action Creators", () => {
  const store = configureStore()({});
  const dispatch = sinon.spy(store, "dispatch");

  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    ["saveBulkAssignedUser", "removeBulkAssignMessages"].forEach(property => {
      expect(creators).to.have.property(property);
      expect(creators[property]).to.be.a("function");
      delete creators[property];
    });

    expect(creators).to.be.empty;
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
        path: actions.BULK_ASSIGN,
        successCallback: [
          {
            action: SET_DIALOG,
            payload: {
              dialog: ASSIGN_DIALOG,
              open: false
            }
          },
          {
            action: SET_DIALOG_PENDING,
            payload: {
              pending: false
            }
          }
        ]
      }
    };

    expect(
      dispatch(
        actionCreators.saveBulkAssignedUser(
          RECORD_PATH.cases,
          [12345, 67890],
          body
        )
      )
    ).to.deep.equals(expected);
  });

  it("should check the 'removeBulkAssignMessages' action creator to remove all the bulk assign", () => {
    const expected = {
      type: `${RECORD_PATH.cases}/${actions.CLEAR_BULK_ASSIGN_MESSAGES}`
    };

    expect(
      dispatch(actionCreators.removeBulkAssignMessages(RECORD_PATH.cases))
    ).to.deep.equals(expected);
  });
});
