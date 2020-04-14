import { ENQUEUE_SNACKBAR } from "../../../notifier";
import { SET_DIALOG, SET_DIALOG_PENDING } from "../../../record-actions";

import actions from "./actions";
import * as actionCreators from "./action-creators";

describe("<RevokeModal /> - transitions/components/revoke-modal/action-creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    ["revokeTransition"].forEach(property => {
      expect(creators).to.have.property(property);
      delete creators[property];
    });

    expect(creators).to.be.empty;
  });

  it("should check the 'revokeTransition' action creator to return the correct object", () => {
    const args = {
      message: "Test message",
      recordType: "cases",
      recordId: "1a2b3c4d",
      transitionType: "referral",
      transitionId: "1234",
      dialogName: "revokeModal-1234",
      failureMessage: "Test failure message"
    };

    const returnObject = actionCreators.revokeTransition(args);
    const expected = {
      api: {
        body: {},
        failureCallback: [
          {
            action: ENQUEUE_SNACKBAR,
            payload: {
              message: args.failureMessage,
              options: {
                key: returnObject.api.failureCallback[0].payload.options.key,
                variant: "error"
              }
            }
          },
          {
            action: SET_DIALOG_PENDING,
            payload: {
              pending: false
            }
          }
        ],
        method: "DELETE",
        path: "cases/1a2b3c4d/referrals/1234",
        successCallback: [
          {
            action: ENQUEUE_SNACKBAR,
            payload: {
              message: args.message,
              options: {
                key: returnObject.api.successCallback[0].payload.options.key,
                variant: "success"
              }
            }
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
        ]
      },
      type: actions.REVOKE_TRANSITION
    };

    expect(returnObject).to.not.be.undefined;
    expect(returnObject).to.deep.equals(expected);
  });
});
