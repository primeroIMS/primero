// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { ENQUEUE_SNACKBAR } from "../../../notifier";
import { CLEAR_DIALOG, SET_DIALOG_PENDING } from "../../../action-dialog";

import actions from "./actions";
import * as actionCreators from "./action-creators";

describe("<RevokeModal /> - transitions/components/revoke-modal/action-creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    ["revokeTransition"].forEach(property => {
      expect(creators).toHaveProperty(property);
      delete creators[property];
    });

    expect(Object.keys(creators)).toHaveLength(0);
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
            action: CLEAR_DIALOG
          }
        ]
      },
      type: actions.REVOKE_TRANSITION
    };

    expect(returnObject).toBeDefined();
    expect(returnObject).toEqual(expected);
  });
});
