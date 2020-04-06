import { expect, stub } from "../../../../test";
import { RECORD_PATH } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";
import {
  SET_DIALOG,
  SET_DIALOG_PENDING
} from "../../../record-actions/actions";

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("<ReferralAction /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).to.have.property("referralDone");
    delete creators.referralDone;

    expect(creators).to.deep.equal({});
  });

  it("should check that 'referralDone' action creator returns the correct object", () => {
    stub(generate, "messageKey").returns(4);

    const args = {
      message: "Updated successfully",
      failureMessage: "Updated unsuccessfully",
      recordId: "10",
      recordType: "cases",
      dialogName: "dialog name",
      transistionId: "20"
    };

    const expectedAction = {
      type: actions.REFERRAL_DONE,
      api: {
        path: `cases/10/referrals/20`,
        method: "DELETE",
        successCallback: [
          {
            action: ENQUEUE_SNACKBAR,
            payload: {
              message: args.message,
              options: {
                variant: "success",
                key: 4
              }
            },
            redirectWithIdFromResponse: false,
            redirect: `/${RECORD_PATH.cases}`
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

    expect(actionCreators.referralDone(args)).to.deep.equal(expectedAction);

    generate.messageKey.restore();
  });
});
