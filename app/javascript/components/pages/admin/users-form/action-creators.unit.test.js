import { stub } from "../../../../test";
import { RECORD_PATH } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";
import {
  SET_DIALOG,
  SET_DIALOG_PENDING
} from "../../../record-actions/actions";

import * as actionsCreators from "./action-creators";
import actions from "./actions";

describe("<UsersForm /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionsCreators };

    ["fetchUser", "saveUser", "clearSelectedUser"].forEach(property => {
      expect(creators).to.have.property(property);
      delete creators[property];
    });

    expect(creators).to.be.empty;
  });

  it("should check that 'fetchUser' action creator returns the correct object", () => {
    const expectedAction = {
      type: actions.FETCH_USER,
      api: {
        path: `${RECORD_PATH.users}/10`
      }
    };

    expect(actionsCreators.fetchUser(10)).to.deep.equal(expectedAction);
  });

  it("should check that 'saveUser' action creator returns the correct object", () => {
    stub(generate, "messageKey").returns(4);

    const args = {
      id: 10,
      body: {
        prop1: "prop-1"
      },
      saveMethod: "update",
      message: "Updated successfully",
      failureMessage: "Updated unsuccessfully",
      dialogName: "dialog"
    };

    const expectedAction = {
      type: actions.SAVE_USER,
      api: {
        path: `${RECORD_PATH.users}/10`,
        method: "PATCH",
        body: args.body,
        successCallback: [
          {
            action: ENQUEUE_SNACKBAR,
            payload: {
              message: args.message,
              options: {
                key: 4,
                variant: "success"
              }
            },
            redirectWithIdFromResponse: false,
            redirect: `/admin/${RECORD_PATH.users}/10`
          },
          {
            action: SET_DIALOG,
            payload: {
              dialog: args.dialogName,
              open: false
            }
          },
          {
            action: SET_DIALOG_PENDING,
            payload: {
              pending: false
            }
          }
        ],
        failureCallback: [
          {
            action: ENQUEUE_SNACKBAR,
            payload: {
              message: args.failureMessage,
              options: {
                variant: "error",
                key: 4
              }
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

    expect(actionsCreators.saveUser(args)).to.deep.equal(expectedAction);

    generate.messageKey.restore();
  });
});
