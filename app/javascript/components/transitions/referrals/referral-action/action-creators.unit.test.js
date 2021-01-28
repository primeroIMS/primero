import { stub } from "../../../../test";
import { RECORD_PATH } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";
import { CLEAR_DIALOG, SET_DIALOG_PENDING } from "../../../action-dialog";

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("<ReferralAction /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).to.have.property("referralDone");
    delete creators.referralDone;

    expect(creators).to.deep.equal({});
  });

  describe("referralDone action creator", () => {
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
            action: CLEAR_DIALOG
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

    beforeEach(() => {
      stub(generate, "messageKey").returns(4);
    });

    afterEach(() => {
      generate.messageKey.restore();
    });

    it("should return the correct action creator", () => {
      expect(actionCreators.referralDone(args)).to.deep.equal(expectedAction);
    });

    context("when a note_on_referral_from_provider is passed", () => {
      it("should return the correct action creator", () => {
        const data = { note_on_referral_from_provider: "some test notes" };

        expectedAction.api = { ...expectedAction.api, body: { data } };

        expect(actionCreators.referralDone({ ...args, data })).to.deep.equal(expectedAction);
      });
    });
  });
});
