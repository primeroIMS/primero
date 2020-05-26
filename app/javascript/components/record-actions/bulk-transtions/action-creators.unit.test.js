import clone from "lodash/clone";
import configureStore from "redux-mock-store";
import sinon from "sinon";

import { ASSIGN_DIALOG } from "../constants";
import { SET_DIALOG, SET_DIALOG_PENDING } from "../actions";

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("bulk-transitons - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    expect(creators).to.have.property("saveBulkAssignedUser");
    delete creators.saveBulkAssignedUser;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'saveAssignedUser' action creator to return the correct object", () => {
    const body = {
      data: {
        trasitioned_to: "primero_cp",
        notes: "Some notes",
        recordsIds: [12345, 67890]
      }
    };
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");
    const expected = {
      type: actions.BULK_ASSIGN_USER_SAVE,
      api: {
        body,
        method: "POST",
        path: "cases/assigns",
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
      dispatch(actionCreators.saveBulkAssignedUser([12345, 67890], body))
    ).to.deep.equals(expected);
  });
});
